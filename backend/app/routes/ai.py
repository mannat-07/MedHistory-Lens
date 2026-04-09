from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import ChatMessage, Prediction, HealthMetric, MedicalReport
from app.schemas import PredictionRequest, ChatMessageCreate, ChatReplyResponse
from app.services.ai_service import ai_service
from app.services.health_service import health_service
from datetime import date
import json
import re

router = APIRouter(prefix="/api", tags=["ai"])

def get_user_id_from_request(request: Request) -> int:
    """Extract user_id from request state"""
    user_id = request.state.user_id if hasattr(request.state, 'user_id') else None
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing user authentication"
        )
    return int(user_id)

@router.post("/predictions")
def analyze_symptoms(request: PredictionRequest, user_id: int = Depends(get_user_id_from_request),
                     db: Session = Depends(get_db)):
    """Analyze symptoms and predict potential diseases"""
    
    if not request.symptoms or len(request.symptoms) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one symptom is required"
        )
    
    # Analyze symptoms using AI service
    predictions = ai_service.analyze_symptoms(request.symptoms)
    
    # Store in database for audit
    prediction_record = Prediction(
        user_id=user_id,
        symptoms=request.symptoms,
        prediction_date=date.today(),
        diseases=predictions
    )
    db.add(prediction_record)
    db.commit()
    
    return {
        "diseases": predictions
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

@router.post("/reports/upload")
async def upload_report(file: UploadFile = File(...), 
                       user_id: int = Depends(get_user_id_from_request),
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
            raw_text=text,
            parsed_data=result,
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
                            
                            # Skip if no value
                            if value is None:
                                continue
                            
                            # Try to convert to float
                            try:
                                value = float(value)
                            except (TypeError, ValueError):
                                continue
                            
                            # Map test names to metric fields
                            if "glucose" in test_name:
                                metrics_dict["glucose"] = value
                            elif "hba1c" in test_name or "hemoglobin a1c" in test_name:
                                metrics_dict["hba1c"] = value
                            elif "total cholesterol" in test_name:
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
                            elif "hemoglobin" in test_name and "a1c" not in test_name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in test_name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in test_name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in test_name or "alanine aminotransferase" in test_name:
                                metrics_dict["alt"] = value
                            elif "ast" in test_name or "aspartate aminotransferase" in test_name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in test_name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in test_name or "b12" in test_name:
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
                            elif "total cholesterol" in name:
                                metrics_dict["total_cholesterol"] = value
                            elif "ldl" in name:
                                metrics_dict["ldl_cholesterol"] = value
                            elif "hdl" in name:
                                metrics_dict["hdl_cholesterol"] = value
                            elif "wbc" in name:
                                metrics_dict["wbc"] = value
                            elif "rbc" in name:
                                metrics_dict["rbc"] = value
                            elif "hemoglobin" in name and "a1c" not in name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in name:
                                metrics_dict["alt"] = value
                            elif "ast" in name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in name:
                                metrics_dict["vitamin_b12"] = value
                            elif "iron" in name:
                                metrics_dict["iron"] = value
            
            # Create HealthMetric record if we have any data
            if metrics_dict:
                health_metric = HealthMetric(
                    user_id=user_id,
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
            "report_title": result.get("patient", {}).get("report_title", "New Report"),
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
                       user_id: int = Depends(get_user_id_from_request),
                       db: Session = Depends(get_db)):
    """Update an existing medical report with a new PDF"""
    
    # Check file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )
    
    try:
        # Check if report exists and belongs to user
        report = db.query(MedicalReport).filter(
            MedicalReport.id == report_id,
            MedicalReport.user_id == user_id
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Read file contents
        contents = await file.read()
        
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
                            
                            if value is None:
                                continue
                            
                            try:
                                value = float(value)
                            except (TypeError, ValueError):
                                continue
                            
                            # Map test names to metric fields
                            if "glucose" in test_name:
                                metrics_dict["glucose"] = value
                            elif "hba1c" in test_name or "hemoglobin a1c" in test_name:
                                metrics_dict["hba1c"] = value
                            elif "total cholesterol" in test_name:
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
                            elif "hemoglobin" in test_name and "a1c" not in test_name:
                                metrics_dict["hemoglobin"] = value
                            elif "platelet" in test_name:
                                metrics_dict["platelets"] = value
                            elif "creatinine" in test_name:
                                metrics_dict["creatinine"] = value
                            elif "alt" in test_name:
                                metrics_dict["alt"] = value
                            elif "ast" in test_name:
                                metrics_dict["ast"] = value
                            elif "vitamin d" in test_name:
                                metrics_dict["vitamin_d"] = value
                            elif "vitamin b12" in test_name:
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
            "new_metrics_count": len(result.get("metrics", []))
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating PDF: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating PDF: {str(e)}"
        )
