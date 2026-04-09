from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import HealthMetric, User, ChatMessage, MedicalReport
from app.schemas import HealthMetricCreate, HealthMetricResponse, DashboardResponse
from app.services.health_service import health_service
from datetime import date
from app.auth import get_current_user_required

router = APIRouter(prefix="/api/health", tags=["health"])

def get_user_id_from_request(request: Request) -> int:
    """Extract user_id from request state (set by middleware)"""
    user_id = request.state.user_id if hasattr(request.state, 'user_id') else None
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing user authentication"
        )
    return int(user_id)


def _base_metrics_query(db: Session, current_user: User):
    return db.query(HealthMetric).filter(HealthMetric.user_id == int(current_user.id))

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    """Get dashboard data (latest metrics, trends, risks, alerts)"""
    
    # Get latest metrics
    latest = _base_metrics_query(db, current_user).order_by(HealthMetric.test_date.desc(), HealthMetric.id.desc()).first()
    
    # If no metrics, return empty/default dashboard
    if not latest:
        return DashboardResponse(
            glucose=None,
            hba1c=None,
            cholesterol=None,
            diabetesRisk=0,
            heartDiseaseRisk=0,
            trends=[],
            alerts=[]
        )
    
    # Get history for trends
    history = _base_metrics_query(db, current_user).order_by(HealthMetric.test_date.asc()).all()
    
    # Calculate risks
    diabetes_risk = health_service.calculate_diabetes_risk(
        latest.hba1c,
        latest.glucose
    )
    heart_risk = health_service.calculate_heart_disease_risk(
        latest.ldl_cholesterol,
        latest.hdl_cholesterol,
        latest.total_cholesterol
    )
    
    # Get trends
    glucose_trend = health_service.get_trend_data(history, "glucose")
    
    # Get alerts
    alerts = health_service.get_flagged_items(latest)
    health_trend_message = _build_health_trend_message(history)
    
    return DashboardResponse(
        glucose=latest.glucose,
        hba1c=f"{latest.hba1c}%" if latest.hba1c else None,
        cholesterol=latest.total_cholesterol,
        diabetesRisk=diabetes_risk,
        heartDiseaseRisk=heart_risk,
        trends=glucose_trend,
        metricTrends={
            "glucose": health_service.get_trend_data(history, "glucose"),
            "cholesterol": health_service.get_trend_data(history, "total_cholesterol"),
            "hba1c": health_service.get_trend_data(history, "hba1c"),
        },
        doctorSummary=_get_latest_doctor_summary(db, current_user),
        healthTrendMessage=health_trend_message,
        alerts=alerts
    )


def _get_latest_doctor_summary(db: Session, current_user: User):
    query = db.query(MedicalReport).filter(MedicalReport.user_id == int(current_user.id))
    latest_report = query.order_by(MedicalReport.created_at.desc()).first()
    return latest_report.doctor_summary if latest_report else None


def _build_health_trend_message(history):
    if len(history) < 2:
        return "Upload one more report to see your health trend clearly."
    prev = history[-2]
    curr = history[-1]
    improvements = 0
    attention = 0

    def score(lower_is_better_field):
        nonlocal improvements, attention
        prev_v = getattr(prev, lower_is_better_field, None)
        curr_v = getattr(curr, lower_is_better_field, None)
        if prev_v is None or curr_v is None:
            return
        if curr_v < prev_v:
            improvements += 1
        elif curr_v > prev_v:
            attention += 1

    score("glucose")
    score("hba1c")
    score("total_cholesterol")

    if improvements > attention:
        return "You are improving overall. Keep your current healthy routine."
    if attention > improvements:
        return "Pay attention to your recent trend and stay consistent with care."
    return "Your trend looks steady. Keep monitoring and maintain healthy habits."

@router.get("/{category}")
def get_health_data(category: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_required)):
    """Get health data for specific category (blood, heart, organs, nutrition)"""
    
    # Validate category
    valid_categories = ["blood", "heart", "organs", "nutrition"]
    if category not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        )
    
    # Get latest metrics
    latest = _base_metrics_query(db, current_user).order_by(HealthMetric.test_date.desc(), HealthMetric.id.desc()).first()
    
    # Default response structure by category
    response = {}
    trend_fields = []
    
    # Return default data if no metrics found
    if not latest:
        if category == "blood":
            response = {"bloodCounts": {"wbc": None, "rbc": None, "hemoglobin": None, "platelets": None}}
        elif category == "heart":
            response = {"heart": {"ldl": None, "hdl": None, "totalCholesterol": None}}
        elif category == "organs":
            response = {"organs": {"glucose": None, "creatinine": None, "alt": None}}
        elif category == "nutrition":
            response = {"nutrition": {"vitaminD": None, "vitaminB12": None, "iron": None}}
        
        response["trends"] = []
        return response
    
    # Get history for trends
    history = _base_metrics_query(db, current_user).order_by(HealthMetric.test_date.asc()).all()
    
    # Return data by category
    if category == "blood":
        response = {
            "bloodCounts": {
                "wbc": latest.wbc,
                "rbc": latest.rbc,
                "hemoglobin": latest.hemoglobin,
                "platelets": latest.platelets
            }
        }
        trend_fields = ["wbc", "rbc", "hemoglobin", "platelets"]
    
    elif category == "heart":
        response = {
            "heart": {
                "ldl": latest.ldl_cholesterol,
                "hdl": latest.hdl_cholesterol,
                "totalCholesterol": latest.total_cholesterol
            }
        }
        trend_fields = ["ldl_cholesterol", "hdl_cholesterol", "total_cholesterol"]
    
    elif category == "organs":
        response = {
            "organs": {
                "glucose": latest.glucose,
                "creatinine": latest.creatinine,
                "alt": latest.alt
            }
        }
        trend_fields = ["glucose", "creatinine", "alt"]
    
    elif category == "nutrition":
        response = {
            "nutrition": {
                "vitaminD": latest.vitamin_d,
                "vitaminB12": latest.vitamin_b12,
                "iron": latest.iron
            }
        }
        trend_fields = ["vitamin_d", "vitamin_b12", "iron"]
    
    # Build trends
    trends = {}
    for field in trend_fields:
        trends[field] = health_service.get_trend_data(history, field)
    
    response["trends"] = trends
    return response

@router.post("/metrics", response_model=HealthMetricResponse)
def create_health_metric(metric_data: HealthMetricCreate, user_id: int = Depends(get_user_id_from_request),
                        db: Session = Depends(get_db)):
    """Create a new health metric record"""
    
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create metric
    new_metric = HealthMetric(
        user_id=user_id,
        **metric_data.dict()
    )
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    
    return HealthMetricResponse.from_orm(new_metric)

@router.get("/history")
def get_health_history(user_id: int = Depends(get_user_id_from_request), months: int = 3, db: Session = Depends(get_db)):
    """Get historical health metrics"""
    
    metrics = health_service.get_metrics_history(db, user_id, months)
    
    return {
        "count": len(metrics),
        "metrics": [HealthMetricResponse.from_orm(m) for m in metrics]
    }
