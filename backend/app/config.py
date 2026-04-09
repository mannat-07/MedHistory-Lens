from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    # Database - Default to SQLite for local dev, use PostgreSQL if specified
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./medhistory.db")
    
    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AI
    ai_model_name: str = os.getenv("AI_MODEL_NAME", "none")
    use_local_ai: bool = os.getenv("USE_LOCAL_AI", "false").lower() == "true"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    huggingface_api_key: Optional[str] = None
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
