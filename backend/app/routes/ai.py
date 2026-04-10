from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import User, ChatMessage, Prediction, HealthMetric, MedicalReport
from app.schemas import PredictionRequest, ChatMessageCreate, ChatReplyResponse
from app.services.ai_service import ai_service
from app.services.health_service import health_service
from datetime import date
from pathlib import Path
from uuid import uuid4
import json
import re
import os
import tempfile
from app.auth import get_current_user_required
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

router = APIRouter(prefix="/api", tags=["ai"])
Report = MedicalReport

def get_user_id_from_request(request: Request) -> int:
    """Extract user_id from request state"""
    user_id = request.state.user_id if hasattr(request.state, 'user_id') else None
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing user authentication"
        )
    return int(user_id)


def _get_reports_for_actor(db: Session, user_id: int, guest_id: str):
    query = db.query(MedicalReport)
    if user_id:
        query = query.filter(MedicalReport.user_id == user_id)
    else:
        query = query.filter(MedicalReport.guest_id == guest_id)
    return query.order_by(desc(MedicalReport.created_at)).all()


def _extract_key_metrics(parsed_data: dict) -> dict:
    metrics = parsed_data.get("metrics", []) if isinstance(parsed_data, dict) else []
    out = {}
    for m in metrics:
        if not isinstance(m, dict):
            continue
        name = str(m.get("test_name", "")).lower()
        val = m.get("value")
        if val is None:
            continue
        if "glucose" in name:
            out["glucose"] = val
        elif "hba1c" in name:
            out["hba1c"] = val
        elif "cholesterol" in name and "hdl" not in name and "ldl" not in name:
            out["total_cholesterol"] = val
        elif "triglyceride" in name:
            out["triglycerides"] = val
        elif "hemoglobin" in name and "a1c" not in name:
            out["hemoglobin"] = val
    return out


def _coerce_numeric(value) -> float | None:
    """Best-effort numeric extraction from parsed metric values."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).replace(",", "")
    match = re.search(r"-?\d+(?:\.\d+)?", text)
    if not match:
        return None
    try:
        return float(match.group(0))
    except ValueError:
        return None


def _get_report_title(parsed_data: dict, report_id: int) -> str:
    """Create a readable report title from parsed metrics/category data."""
    if not isinstance(parsed_data, dict):
        return f"Medical Report #{report_id}"

    patient = parsed_data.get("patient", {}) if isinstance(parsed_data.get("patient"), dict) else {}
    explicit_title = patient.get("report_title")
    if explicit_title and str(explicit_title).strip():
        return str(explicit_title).strip()

    metrics = parsed_data.get("metrics", []) if isinstance(parsed_data.get("metrics"), list) else []
    categories = {str(m.get("category", "")).strip().lower() for m in metrics if isinstance(m, dict)}

    if any("complete blood count" in c or "cbc" in c for c in categories):
        return "Complete Blood Count (CBC)"
    if any("lipid" in c for c in categories):
        return "Lipid Panel & Cholesterol"
    if any("organ" in c or "blood chemistry" in c for c in categories):
        return "Comprehensive Metabolic Panel"
    if any("vitamin" in c or "mineral" in c for c in categories):
        return "Vitamin & Mineral Analysis"

    if metrics and isinstance(metrics[0], dict):
        first_metric = str(metrics[0].get("test_name", "")).strip()
        if first_metric:
            return f"{first_metric} Report"

    return f"Medical Report #{report_id}"


def _get_reports_directory() -> Path:
    """Resolve and create storage directory for uploaded report PDFs."""
    backend_root = Path(__file__).resolve().parents[2]
    reports_dir = backend_root / "uploads" / "reports"
    reports_dir.mkdir(parents=True, exist_ok=True)
    return reports_dir

@router.post("/predictions")
def analyze_symptoms(request: PredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    """Analyze symptoms and predict potential risks using reports + symptoms."""
    
    if not request.symptoms or len(request.symptoms) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one symptom is required"
        )
    
    user_id = int(current_user.id)
    guest_id = None
    reports = _get_reports_for_actor(db, user_id, guest_id)
    latest_report = reports[0] if reports else None
    latest_reports = []
    if latest_report:
        latest_reports.append({
            "id": latest_report.id,
            "date": latest_report.upload_date.isoformat() if latest_report.upload_date else None,
            "doctor_summary": latest_report.doctor_summary,
            "metrics": (latest_report.parsed_data or {}).get("metrics", []) if isinstance(latest_report.parsed_data, dict) else [],
            "key_metrics": _extract_key_metrics(latest_report.parsed_data if isinstance(latest_report.parsed_data, dict) else {})
        })
    predictions = ai_service.generate_health_predictions(
        request.symptoms,
        {"reports": latest_reports}
    )
    
    # Store in database for audit
    prediction_record = Prediction(
        user_id=user_id,
        symptoms=request.symptoms,
        prediction_date=date.today(),
        diseases=predictions.get("predictions", [])
    )
    db.add(prediction_record)
    db.commit()
    
    return {
        "predictions": predictions.get("predictions", [])
    }

@router.post("/chat")
def send_chat_message(request: ChatMessageCreate, user_id: int = Depends(get_user_id_from_request),
                      db: Session = Depends(get_db)):
    """Send message and get AI response"""
    
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )
    
    # Store user message
    user_msg = ChatMessage(
        user_id=user_id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()
    
    # Get user's latest health metrics for context
    latest_metric = health_service.get_latest_metrics(db, user_id)
    health_context = {}
    if latest_metric:
        health_context = {
            "glucose": latest_metric.glucose,
            "hba1c": latest_metric.hba1c,
            "total_cholesterol": latest_metric.total_cholesterol,
            "ldl": latest_metric.ldl_cholesterol,
            "wbc": latest_metric.wbc
        }
    
    # Generate AI response
    ai_response = ai_service.generate_health_response(
        request.message,
        health_context
    )
    
    # Store AI response
    ai_msg = ChatMessage(
        user_id=user_id,
        role="ai",
        content=ai_response
    )
    db.add(ai_msg)
    db.commit()
    
    return ChatReplyResponse(reply=ai_response)

@router.get("/chat/history")
def get_chat_history(user_id: int = None, limit: int = 50, 
                     db: Session = Depends(get_db)):
    """Get chat message history"""
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID required"
        )
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user_id
    ).order_by(desc(ChatMessage.created_at)).limit(limit).all()
    
    # Reverse to get chronological order
    messages = list(reversed(messages))
    
    return {
        "count": len(messages),
        "messages": [
            {
                "role": m.role,
                "content": m.content,
                "timestamp": m.created_at.isoformat()
            }
            for m in messages
        ]
    }

@router.post("/chat/clear")
def clear_chat_history(user_id: int = None, db: Session = Depends(get_db)):
    """Clear chat history for user"""
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID required"
        )
    
    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
    db.commit()
    
    return {"message": "Chat history cleared"}

@router.get("/diet-plan")
def get_diet_plan(user_id: int = None, db: Session = Depends(get_db)):
    """Get personalized diet plan"""
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID required"
        )
    
    # Get latest metrics
    latest = health_service.get_latest_metrics(db, user_id)
    if not latest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No health metrics found. Please add health data first."
        )
    
    # Generate diet plan
    health_metrics = {
        "glucose": latest.glucose,
        "hba1c": latest.hba1c,
        "total_cholesterol": latest.total_cholesterol,
        "ldl": latest.ldl_cholesterol
    }
    
    diet_plan = ai_service.generate_diet_plan(health_metrics)
    
    return diet_plan

@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_required),
):
    """Get all uploaded reports for the current user."""
    user_id = int(current_user.id)
    query = db.query(MedicalReport).filter(MedicalReport.user_id == user_id)
    reports = query.order_by(desc(MedicalReport.created_at)).all()

    response = []
    for report in reports:
        parsed_data = report.parsed_data if isinstance(report.parsed_data, dict) else {}
        patient = parsed_data.get("patient", {}) if isinstance(parsed_data, dict) else {}
        metrics = parsed_data.get("metrics", []) if isinstance(parsed_data, dict) else []

        report_title = _get_report_title(parsed_data, report.id)
        doctor = patient.get("doctor") or "Dr. [Pending]"
        status_value = "reviewed" if metrics else "pending"

        response.append({
            "id": report.id,
            "date": report.upload_date.isoformat() if report.upload_date else None,
            "title": report_title,
            "doctor": doctor,
            "status": status_value,
            "summary": parsed_data.get("summary") if isinstance(parsed_data, dict) else None,
            "doctor_summary": report.doctor_summary,
            "doctor_advice": report.doctor_advice,
            "voice_text": report.doctor_summary,
            "key_metrics": _extract_key_metrics(parsed_data),
            "can_download": bool(report.file_path or report.file_url)
        })

    return {
        "success": True,
        "reports": response
    }


@router.get("/reports/{report_id}/download")
async def download_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not (report.file_path or report.file_url) or not os.path.exists(report.file_path or report.file_url):
        raise HTTPException(404, "Report not found")

    if report.user_id != int(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this report")
    return FileResponse(report.file_path or report.file_url, filename=f"Lab_Report_{report_id}.pdf", media_type="application/pdf")

@router.post("/reports/upload")
async def upload_report(
                       file: UploadFile = File(...), 
                       current_user: User = Depends(get_current_user_required),
                       db: Session = Depends(get_db)):
    """Upload and analyze a medical report (PDF)"""
    
    # Check file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    try:
        # Read file contents
        contents = await file.read()

        # Persist original PDF for later download.
        reports_dir = _get_reports_directory()
        user_id = int(current_user.id)
        guest_id = None
        actor_prefix = f"user{user_id}"
        file_name = f"{actor_prefix}_{uuid4().hex}.pdf"
        file_path = reports_dir / file_name
        file_path.write_bytes(contents)
        
        # Extract text with PyMuPDF
        import fitz
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        # Analyze report with AI
        result = ai_service.analyze_report(text)
        
        # Save report to DB
        report = MedicalReport(
            user_id=user_id,
            guest_id=guest_id,
            file_url=str(file_path),
            file_path=str(file_path),
            raw_text=text,
            parsed_data=result,
            doctor_summary=ai_service.generate_doctor_summary(result),
            doctor_advice="Keep consistent routines and review your next report for steady progress.",
            report_type="lab",
            upload_date=date.today()
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        
        # Extract metrics from parsed data and save to HealthMetric table
        try:
            metrics_dict = {}
            
            # Handle new schema with "metrics" array
            if isinstance(result, dict) and "metrics" in result:
                metrics = result.get("metrics", [])
                if isinstance(metrics, list):
                    for metric in metrics:
                        if isinstance(metric, dict):
                            test_name = metric.get("test_name", "").lower()
                            value = metric.get("value")
                            
                            value = _coerce_numeric(value)
                            if value is None:
                                continue
                            
                            # Map test names to metric fields
                            if "glucose" in test_name:
                                metrics_dict["glucose"] = value
                            elif "hba1c" in test_name or "hemoglobin a1c" in test_name:
                                metrics_dict["hba1c"] = value
                            elif "total cholesterol" in test_name or (
                                "cholesterol" in test_name
                                and "hdl" not in test_name
                                and "ldl" not in test_name
                                and "vldl" not in test_name
                            ):
                                metrics_dict["total_cholesterol"] = value
                            elif "ldl" in test_name or "low density lipoprotein" in test_name:
                                metrics_dict["ldl_cholesterol"] = value
                            elif "hdl" in test_name or "high density lipoprotein" in test_name:
                                metrics_dict["hdl_cholesterol"] = value
                            elif "triglyceride" in test_name:
                                # Not in current DB schema, skipping
                                pass
                            elif "wbc" in test_name or "white blood cell" in test_name:
                                metrics_dict["wbc"] = value
                            elif "rbc" in test_name or "red blood cell" in test_name:
                                metrics_dict["rbc"] = value
                            elif ("hemoglobin" in test_name or "hgb" in test_name) and "a1c" not in test_name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in test_name or "plt" in test_name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in test_name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in test_name or "alanine aminotransferase" in test_name or "sgpt" in test_name:
                                metrics_dict["alt"] = value
                            elif "ast" in test_name or "aspartate aminotransferase" in test_name or "sgot" in test_name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in test_name or "25-hydroxy" in test_name or "25 oh" in test_name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in test_name or "b12" in test_name or "cobalamin" in test_name:
                                metrics_dict["vitamin_b12"] = value
                            elif "iron" in test_name:
                                metrics_dict["iron"] = value
            
            # Fallback: Also try old "biomarkers" format for compatibility
            elif isinstance(result, dict) and "biomarkers" in result:
                biomarkers = result.get("biomarkers", [])
                if isinstance(biomarkers, list):
                    for biomarker in biomarkers:
                        if isinstance(biomarker, dict):
                            name = biomarker.get("name", "").lower()
                            value_str = biomarker.get("value", "")
                            
                            # Try to extract numeric value
                            try:
                                value = float(re.search(r"[\d.]+", str(value_str)).group() if value_str else 0)
                            except (AttributeError, ValueError):
                                continue
                            
                            # Map biomarker names to metric fields (same as above)
                            if "glucose" in name:
                                metrics_dict["glucose"] = value
                            elif "hba1c" in name:
                                metrics_dict["hba1c"] = value
                            elif "total cholesterol" in name or (
                                "cholesterol" in name
                                and "hdl" not in name
                                and "ldl" not in name
                                and "vldl" not in name
                            ):
                                metrics_dict["total_cholesterol"] = value
                            elif "ldl" in name:
                                metrics_dict["ldl_cholesterol"] = value
                            elif "hdl" in name:
                                metrics_dict["hdl_cholesterol"] = value
                            elif "wbc" in name:
                                metrics_dict["wbc"] = value
                            elif "rbc" in name:
                                metrics_dict["rbc"] = value
                            elif ("hemoglobin" in name or "hgb" in name) and "a1c" not in name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in name or "plt" in name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in name or "sgpt" in name:
                                metrics_dict["alt"] = value
                            elif "ast" in name or "sgot" in name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in name or "25-hydroxy" in name or "25 oh" in name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in name or "b12" in name or "cobalamin" in name:
                                metrics_dict["vitamin_b12"] = value
                            elif "iron" in name:
                                metrics_dict["iron"] = value
            
            # Create HealthMetric record if we have any data
            if metrics_dict:
                health_metric = HealthMetric(
                    user_id=user_id,
                    guest_id=guest_id,
                    test_date=date.today(),
                    **metrics_dict
                )
                db.add(health_metric)
                db.commit()
                db.refresh(health_metric)
                print(f"Saved health metrics: {metrics_dict}")
        except Exception as e:
            print(f"Warning: Could not save health metrics: {e}")
            # Don't fail the upload if metrics save fails
        
        return {
            "success": True,
            "report_id": report.id,
            "report_title": _get_report_title(result, report.id),
            "doctor_summary": report.doctor_summary,
            "data": result
        }
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing PDF: {str(e)}"
        )

@router.put("/reports/{report_id}")
async def update_report(report_id: int, file: UploadFile = File(...), 
                       current_user: User = Depends(get_current_user_required),
                       db: Session = Depends(get_db)):
    """Update an existing medical report with a new PDF"""
    
    # Check file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    try:
        user_id = int(current_user.id)
        base_query = db.query(MedicalReport).filter(
            MedicalReport.id == report_id,
            MedicalReport.user_id == user_id,
        )
        report = base_query.first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Read file contents
        contents = await file.read()

        # Overwrite existing file or create a new one for this report.
        if report.file_url:
            file_path = Path(report.file_url)
            file_path.parent.mkdir(parents=True, exist_ok=True)
        else:
            reports_dir = _get_reports_directory()
            actor_prefix = f"user{user_id}"
            file_path = reports_dir / f"{actor_prefix}_{uuid4().hex}.pdf"
            report.file_url = str(file_path)
            report.file_path = str(file_path)
        file_path.write_bytes(contents)
        
        # Extract text with PyMuPDF
        import fitz
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        # Analyze report with AI
        result = ai_service.analyze_report(text)
        
        # Update report
        report.raw_text = text
        report.parsed_data = result
        report.doctor_summary = ai_service.generate_doctor_summary(result)
        report.doctor_advice = "Stay consistent with healthy habits and keep monitoring trends."
        report.upload_date = date.today()
        db.commit()
        db.refresh(report)
        
        # Extract metrics and update HealthMetric table
        try:
            metrics_dict = {}
            
            # Handle new schema with "metrics" array
            if isinstance(result, dict) and "metrics" in result:
                metrics = result.get("metrics", [])
                if isinstance(metrics, list):
                    for metric in metrics:
                        if isinstance(metric, dict):
                            test_name = metric.get("test_name", "").lower()
                            value = metric.get("value")
                            
                            value = _coerce_numeric(value)
                            if value is None:
                                continue
                            
                            # Map test names to metric fields
                            if "glucose" in test_name:
                                metrics_dict["glucose"] = value
                            elif "hba1c" in test_name or "hemoglobin a1c" in test_name:
                                metrics_dict["hba1c"] = value
                            elif "total cholesterol" in test_name or (
                                "cholesterol" in test_name
                                and "hdl" not in test_name
                                and "ldl" not in test_name
                                and "vldl" not in test_name
                            ):
                                metrics_dict["total_cholesterol"] = value
                            elif "ldl" in test_name:
                                metrics_dict["ldl_cholesterol"] = value
                            elif "hdl" in test_name:
                                metrics_dict["hdl_cholesterol"] = value
                            elif "triglyceride" in test_name:
                                # Not in current DB schema, skipping
                                pass
                            elif "wbc" in test_name:
                                metrics_dict["wbc"] = value
                            elif "rbc" in test_name:
                                metrics_dict["rbc"] = value
                            elif ("hemoglobin" in test_name or "hgb" in test_name) and "a1c" not in test_name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in test_name or "plt" in test_name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in test_name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in test_name or "sgpt" in test_name:
                                metrics_dict["alt"] = value
                            elif "ast" in test_name or "sgot" in test_name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in test_name or "25-hydroxy" in test_name or "25 oh" in test_name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in test_name or "b12" in test_name or "cobalamin" in test_name:
                                metrics_dict["vitamin_b12"] = value
                            elif "iron" in test_name:
                                metrics_dict["iron"] = value
            
            # Update existing HealthMetric or create new one
            if metrics_dict:
                latest_metric = db.query(HealthMetric).filter(
                    HealthMetric.user_id == user_id
                ).order_by(desc(HealthMetric.id)).first()
                
                if latest_metric:
                    # Update existing metric
                    for key, value in metrics_dict.items():
                        setattr(latest_metric, key, value)
                    db.commit()
                    db.refresh(latest_metric)
                else:
                    # Create new metric
                    health_metric = HealthMetric(
                        user_id=user_id,
                        test_date=date.today(),
                        **metrics_dict
                    )
                    db.add(health_metric)
                    db.commit()
                    db.refresh(health_metric)
                
                print(f"Updated health metrics: {metrics_dict}")
        except Exception as e:
            print(f"Warning: Could not update health metrics: {e}")
        
        return {
            "success": True,
            "message": "Report updated successfully",
            "report_id": report.id,
            "doctor_summary": report.doctor_summary,
            "new_metrics_count": len(result.get("metrics", [])),
            "data": result
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating PDF: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating PDF: {str(e)}"
        )


@router.post("/reports/{report_id}/diet-plan")
def generate_report_diet_plan(report_id: int, payload: dict = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    user_id = int(current_user.id)
    query = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user_id)
    report = query.first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    parsed_data = report.parsed_data if isinstance(report.parsed_data, dict) else {}
    metrics = _extract_key_metrics(parsed_data)
    symptoms = payload.get("symptoms", []) if isinstance(payload, dict) else []
    language = payload.get("language", "en") if isinstance(payload, dict) else "en"
    plan = ai_service.generate_personalized_diet_plan(metrics=metrics, symptoms=symptoms, language=language)
    report.diet_plan_cache = plan
    db.commit()
    return {"success": True, "diet_plan": plan, "metrics_used": metrics}


@router.post("/reports/{report_id}/share")
def create_share_link(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    user_id = int(current_user.id)
    query = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user_id)
    report = query.first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.share_token:
        report.share_token = uuid4().hex
        db.commit()
        db.refresh(report)
    return {"success": True, "share_url": f"/api/public/reports/{report.share_token}"}


@router.get("/public/reports/{share_token}")
def get_public_report(share_token: str, language: str = "en", db: Session = Depends(get_db)):
    report = db.query(MedicalReport).filter(MedicalReport.share_token == share_token).first()
    if not report:
        raise HTTPException(status_code=404, detail="Shared report not found")
    summary = report.doctor_summary or ""
    if language.lower().startswith("hi"):
        summary = ai_service.translate_patient_text(summary, "hi")
    return {
        "title": f"Shared Report #{report.id}",
        "doctor_summary": summary,
        "doctor_advice": report.doctor_advice,
        "diet_plan": report.diet_plan_cache or {},
        "key_metrics": _extract_key_metrics(report.parsed_data if isinstance(report.parsed_data, dict) else {})
    }


@router.get("/reports/{report_id}/export-pdf")
def export_report_pdf(report_id: int, language: str = "en", db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    user_id = int(current_user.id)
    query = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user_id)
    report = query.first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    summary = report.doctor_summary or ""
    if language.lower().startswith("hi"):
        summary = ai_service.translate_patient_text(summary, "hi")
    metrics = _extract_key_metrics(report.parsed_data if isinstance(report.parsed_data, dict) else {})
    diet = report.diet_plan_cache or {}

    fd, tmp_path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    c = canvas.Canvas(tmp_path, pagesize=A4)
    y = 800
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, f"MedHistory Lens - Full Report #{report.id}")
    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "Doctor Summary")
    y -= 20
    c.setFont("Helvetica", 10)
    for line in (summary or "No summary").splitlines():
        c.drawString(40, y, line[:110])
        y -= 14
    y -= 8
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "Key Metrics")
    y -= 18
    c.setFont("Helvetica", 10)
    for k, v in metrics.items():
        c.drawString(40, y, f"- {k}: {v}")
        y -= 14
    y -= 8
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "Personalized Diet Plan")
    y -= 18
    c.setFont("Helvetica", 10)
    for sec in ("breakfast", "lunch", "dinner", "snacks", "avoid"):
        items = diet.get(sec, [])
        if items:
            c.drawString(40, y, f"{sec.title()}: {', '.join([str(i) for i in items])[:100]}")
            y -= 14
    c.drawString(40, y, f"Doctor Voice Note: {ai_service.generate_voice_friendly_text(summary)[:100]}")
    c.save()
    return FileResponse(tmp_path, filename=f"MedHistory_Report_{report_id}.pdf", media_type="application/pdf")
import edge_tts
from fastapi.responses import FileResponse
from pydantic import BaseModel
class TTSRequest(BaseModel):
    text: str

@router.post('/ai/tts')
async def generate_tts(body: TTSRequest):
    if not body.text:
        raise HTTPException(status_code=400, detail='Text is required')
    import tempfile, hashlib, os
    filename = hashlib.md5(body.text.encode('utf-8')).hexdigest() + '.mp3'
    filepath = os.path.join(tempfile.gettempdir(), filename)
    if not os.path.exists(filepath):
        communicate = edge_tts.Communicate(body.text, 'en-US-ChristopherNeural')
        await communicate.save(filepath)
    return FileResponse(filepath, media_type='audio/mpeg')
