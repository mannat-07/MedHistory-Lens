from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import HealthMetric, User, ChatMessage
from app.schemas import HealthMetricCreate, HealthMetricResponse, DashboardResponse
from app.services.health_service import health_service
from datetime import date

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

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(user_id: int = Depends(get_user_id_from_request), db: Session = Depends(get_db)):
    """Get dashboard data (latest metrics, trends, risks, alerts)"""
    
    # Get latest metrics
    latest = health_service.get_latest_metrics(db, user_id)
    if not latest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No health metrics found"
        )
    
    # Get history for trends
    history = health_service.get_metrics_history(db, user_id, months=3)
    
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
    
    return DashboardResponse(
        glucose=latest.glucose,
        hba1c=f"{latest.hba1c}%" if latest.hba1c else None,
        cholesterol=latest.total_cholesterol,
        diabetesRisk=diabetes_risk,
        heartDiseaseRisk=heart_risk,
        trends=glucose_trend,
        alerts=alerts
    )

@router.get("/{category}")
def get_health_data(category: str, user_id: int = Depends(get_user_id_from_request), db: Session = Depends(get_db)):
    """Get health data for specific category (blood, heart, organs, nutrition)"""
    
    # Validate category
    valid_categories = ["blood", "heart", "organs", "nutrition"]
    if category not in valid_categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        )
    
    # Get latest metrics
    latest = health_service.get_latest_metrics(db, user_id)
    if not latest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No health metrics found"
        )
    
    # Get history for trends
    history = health_service.get_metrics_history(db, user_id, months=3)
    
    # Return data by category
    category_data = {}
    
    if category == "blood":
        category_data = {
            "wbc": latest.wbc,
            "rbc": latest.rbc,
            "hemoglobin": latest.hemoglobin,
            "platelets": latest.platelets
        }
        trend_fields = ["wbc", "rbc", "hemoglobin", "platelets"]
    
    elif category == "heart":
        category_data = {
            "ldl": latest.ldl_cholesterol,
            "hdl": latest.hdl_cholesterol,
            "totalCholesterol": latest.total_cholesterol
        }
        trend_fields = ["ldl_cholesterol", "hdl_cholesterol", "total_cholesterol"]
    
    elif category == "organs":
        category_data = {
            "glucose": latest.glucose,
            "creatinine": latest.creatinine,
            "alt": latest.alt
        }
        trend_fields = ["glucose", "creatinine", "alt"]
    
    elif category == "nutrition":
        category_data = {
            "vitaminD": latest.vitamin_d,
            "vitaminB12": latest.vitamin_b12,
            "iron": latest.iron
        }
        trend_fields = ["vitamin_d", "vitamin_b12", "iron"]
    
    # Build trends
    trends = {}
    for field in trend_fields:
        trends[field] = health_service.get_trend_data(history, field)
    
    return {
        "data": category_data,
        "trends": trends
    }

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
