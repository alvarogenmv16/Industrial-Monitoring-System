from fastapi import APIRouter, Depends, HTTPException
from sqlite3 import Connection
from api.connector import get_db
from services import motor_service
from api.schemas import MotorTelemetry
from typing import List

router = APIRouter(prefix="/motors", tags=["Motors"])

@router.get("/", response_model=List[int])
async def get_motor_ids(db:Connection = Depends(get_db)):
    data = motor_service.get_motor_ids(db)

    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"Failed to retrieve motor IDs from the database."
        )
    return data

@router.get("/{motor_id}/telemetry/latest", response_model=MotorTelemetry)
async def get_motor_status(motor_id: int, db: Connection = Depends(get_db)):
    data = motor_service.get_motor_data(db, motor_id)

    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"No data found for motor with ID: {motor_id}"
        )

    return dict(data)   # Convert sqlite3.Row to a regular dictionary for Pydantic model parsing