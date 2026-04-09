from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Text, JSON, Index
from sqlalchemy.sql import func
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class HealthMetric(Base):
    __tablename__ = "health_metrics"
    __table_args__ = (
        Index('idx_health_user_date', 'user_id', 'test_date'),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    test_date = Column(Date, nullable=False)
    
    # Blood metrics
    wbc = Column(Float, nullable=True)  # White Blood Cells
    rbc = Column(Float, nullable=True)  # Red Blood Cells
    hemoglobin = Column(Float, nullable=True)
    platelets = Column(Float, nullable=True)
    
    # Blood sugar & metabolism
    glucose = Column(Float, nullable=True)
    hba1c = Column(Float, nullable=True)
    
    # Cholesterol
    ldl_cholesterol = Column(Float, nullable=True)
    hdl_cholesterol = Column(Float, nullable=True)
    total_cholesterol = Column(Float, nullable=True)
    
    # Organ function
    creatinine = Column(Float, nullable=True)
    alt = Column(Float, nullable=True)
    ast = Column(Float, nullable=True)
    
    # Vitamins & minerals
    vitamin_d = Column(Float, nullable=True)
    vitamin_b12 = Column(Float, nullable=True)
    iron = Column(Float, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    __table_args__ = (
        Index('idx_chat_user_date', 'user_id', 'created_at'),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    role = Column(String(10), nullable=False)  # 'user' or 'ai'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    symptoms = Column(JSON, nullable=True)  # List of symptoms
    prediction_date = Column(Date, nullable=False)
    diseases = Column(JSON, nullable=True)  # Disease predictions with probabilities
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    file_url = Column(String(500))
    upload_date = Column(Date, nullable=False)
    report_type = Column(String(50))  # 'blood_test', 'general', etc
    created_at = Column(DateTime(timezone=True), server_default=func.now())
