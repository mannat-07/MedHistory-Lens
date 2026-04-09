from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# ========================
# Auth Schemas
# ========================
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ========================
# Health Metrics Schemas
# ========================
class HealthMetricCreate(BaseModel):
    test_date: date
    wbc: Optional[float] = None
    rbc: Optional[float] = None
    hemoglobin: Optional[float] = None
    platelets: Optional[float] = None
    glucose: Optional[float] = None
    hba1c: Optional[float] = None
    ldl_cholesterol: Optional[float] = None
    hdl_cholesterol: Optional[float] = None
    total_cholesterol: Optional[float] = None
    creatinine: Optional[float] = None
    alt: Optional[float] = None
    ast: Optional[float] = None
    vitamin_d: Optional[float] = None
    vitamin_b12: Optional[float] = None
    iron: Optional[float] = None

class HealthMetricResponse(BaseModel):
    id: int
    test_date: date
    wbc: Optional[float]
    rbc: Optional[float]
    hemoglobin: Optional[float]
    platelets: Optional[float]
    glucose: Optional[float]
    hba1c: Optional[float]
    ldl_cholesterol: Optional[float]
    hdl_cholesterol: Optional[float]
    total_cholesterol: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    glucose: Optional[float]
    hba1c: Optional[str]
    cholesterol: Optional[float]
    diabetesRisk: int
    heartDiseaseRisk: int
    trends: List[dict]
    alerts: List[dict]

class HealthDataResponse(BaseModel):
    data: dict
    trends: List[dict]

# ========================
# Chat Schemas
# ========================
class ChatMessageCreate(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ChatReplyResponse(BaseModel):
    reply: str

# ========================
# AI Prediction Schemas
# ========================
class PredictionRequest(BaseModel):
    symptoms: List[str]

class DiseaseRisk(BaseModel):
    disease: str
    probability: float
    risk: str  # 'low', 'medium', 'high'
    description: str
    suggestedActions: List[str]

class PredictionResponse(BaseModel):
    diseases: List[DiseaseRisk]
