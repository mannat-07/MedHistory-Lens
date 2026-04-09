from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta, date
from app.models import HealthMetric, User
from typing import List, Dict, Optional

class HealthDataService:
    """Service for managing health data and calculations"""
    
    @staticmethod
    def get_latest_metrics(db: Session, user_id: int) -> Optional[Dict]:
        """Get the most recent health metrics for a user"""
        metric = db.query(HealthMetric).filter(
            HealthMetric.user_id == user_id
        ).order_by(desc(HealthMetric.test_date)).first()
        
        return metric
    
    @staticmethod
    def get_metrics_history(db: Session, user_id: int, months: int = 3) -> List[HealthMetric]:
        """Get health metrics history for specified months"""
        cutoff_date = date.today() - timedelta(days=months * 30)
        metrics = db.query(HealthMetric).filter(
            HealthMetric.user_id == user_id,
            HealthMetric.test_date >= cutoff_date
        ).order_by(HealthMetric.test_date).all()
        
        return metrics
    
    @staticmethod
    def calculate_diabetes_risk(hba1c: float, glucose: float, bmi: Optional[float] = None) -> int:
        """
        Calculate diabetes risk percentage based on health metrics
        Returns 0-100 percentage
        """
        risk = 0
        
        # HbA1c scoring
        if hba1c and hba1c >= 6.5:
            risk += 40  # High risk
        elif hba1c and hba1c >= 5.7:
            risk += 25  # Prediabetes range
        elif hba1c and hba1c >= 5.0:
            risk += 10
        
        # Glucose scoring
        if glucose and glucose >= 126:
            risk += 35  # Fasting glucose > 126 indicates diabetes
        elif glucose and glucose >= 100:
            risk += 20  # Impaired fasting glucose
        elif glucose and glucose >= 70:
            risk += 5
        
        # BMI factor (if available)
        if bmi and bmi >= 30:
            risk += 15  # Obesity
        elif bmi and bmi >= 25:
            risk += 8   # Overweight
        
        return min(100, risk)
    
    @staticmethod
    def calculate_heart_disease_risk(ldl: float, hdl: float, total_chol: float, 
                                     systolic_bp: Optional[float] = None) -> int:
        """
        Calculate cardiovascular disease risk percentage
        Returns 0-100 percentage
        """
        risk = 0
        
        # LDL scoring (bad cholesterol - higher is worse)
        if ldl and ldl >= 160:
            risk += 30  # Very high
        elif ldl and ldl >= 130:
            risk += 20  # High
        elif ldl and ldl >= 100:
            risk += 10
        
        # HDL scoring (good cholesterol - lower is worse)
        if hdl and hdl < 40:
            risk += 25  # Low HDL is risky
        elif hdl and hdl < 50:
            risk += 15
        
        # Total cholesterol
        if total_chol and total_chol >= 240:
            risk += 20  # High
        elif total_chol and total_chol >= 200:
            risk += 10
        
        # Blood pressure factor (if available)
        if systolic_bp and systolic_bp >= 140:
            risk += 20  # Hypertension
        elif systolic_bp and systolic_bp >= 130:
            risk += 10  # Elevated
        
        return min(100, risk)
    
    @staticmethod
    def get_trend_data(metrics: List[HealthMetric], metric_name: str) -> List[Dict]:
        """
        Extract trend data for a specific metric
        Returns list of {date, value} dicts
        """
        trend = []
        for metric in metrics:
            value = getattr(metric, metric_name, None)
            if value is not None:
                trend.append({
                    "date": metric.test_date.strftime("%b %d"),
                    "value": round(value, 2)
                })
        return trend
    
    @staticmethod
    def get_flagged_items(metric: HealthMetric) -> List[Dict]:
        """
        Identify abnormal health metrics based on standard ranges
        """
        alerts = []
        
        # Reference ranges
        ranges = {
            "glucose": (70, 100),
            "hba1c": (4.0, 5.6),
            "ldl_cholesterol": (0, 100),
            "hdl_cholesterol": (40, 200),
            "total_cholesterol": (0, 200),
            "wbc": (4.5, 11.0),
            "rbc": (4.5, 5.5),
            "hemoglobin": (13.5, 17.5),
            "platelets": (150, 400),
            "vitamin_d": (30, 100),
            "creatinine": (0.7, 1.3),
        }
        
        for field, (min_val, max_val) in ranges.items():
            value = getattr(metric, field, None)
            if value is None:
                continue
            
            if value < min_val:
                status = "warning" if value > min_val * 0.8 else "danger"
                alerts.append({
                    "name": field.replace("_", " ").title(),
                    "value": f"{value:.1f}",
                    "range": f"{min_val}-{max_val}",
                    "status": status
                })
            elif value > max_val:
                status = "warning" if value < max_val * 1.2 else "danger"
                alerts.append({
                    "name": field.replace("_", " ").title(),
                    "value": f"{value:.1f}",
                    "range": f"{min_val}-{max_val}",
                    "status": status
                })
        
        return alerts[:5]  # Return top 5 alerts

# Global service instance
health_service = HealthDataService()
