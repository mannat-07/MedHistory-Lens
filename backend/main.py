from fastapi import FastAPI, Header, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import init_db
from app.routes import auth, health, ai
from app.auth import decode_access_token

# Create FastAPI app (don't call init_db() on import - do it on startup instead)
app = FastAPI(
    title="MedHistory Lens API",
    description="Backend API for medical history and health analytics",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to extract user_id from Authorization header
@app.middleware("http")
async def add_user_id(request, call_next):
    """Extract user_id from Bearer token and add to request state"""
    user_id = None
    auth_header = request.headers.get("Authorization", "")
    
    # Try to extract from Bearer token first
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        payload = decode_access_token(token)
        if payload:
            user_id = payload.get("sub")
    
    # Fall back to X-User-ID header if Bearer token didn't work
    if not user_id:
        user_id = request.headers.get("X-User-ID")

    guest_id = request.headers.get("X-Guest-ID")
    
    # Set user_id in request state
    if user_id:
        request.state.user_id = user_id
    if guest_id:
        request.state.guest_id = guest_id
    
    response = await call_next(request)
    return response

# Include routers
app.include_router(auth.router)
app.include_router(health.router)
app.include_router(ai.router)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup"""
    try:
        init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")

# Root endpoint
@app.get("/")
def root():
    """API health check"""
    return {
        "status": "ok",
        "message": "MedHistory Lens API is running",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
