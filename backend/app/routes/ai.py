from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import ChatMessage, Prediction, HealthMetric
from app.schemas import PredictionRequest, ChatMessageCreate, ChatReplyResponse
from app.services.ai_service import ai_service
from app.services.health_service import health_service
from datetime import date

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
