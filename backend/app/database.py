from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Create database engine
engine_kwargs = {
    "echo": settings.debug,
}

# Add pool settings only for non-SQLite databases
if not settings.database_url.startswith("sqlite"):
    engine_kwargs["pool_pre_ping"] = True
    
engine = create_engine(
    settings.database_url,
    **engine_kwargs,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)

# SQLite specific setup
if settings.database_url.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """Dependency injection for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
