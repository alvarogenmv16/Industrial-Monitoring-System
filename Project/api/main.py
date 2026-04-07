from fastapi import FastAPI
from routers.motor_router import router as motor_router

app = FastAPI(title="Industrial Monitoring API", version="1.0")
# Include the motor router to handle all machine-related endpoints
app.include_router(motor_router)