from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.motor_router import router as motor_router

app = FastAPI(title="Industrial Monitoring API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include the motor router to handle all machine-related endpoints
app.include_router(motor_router)