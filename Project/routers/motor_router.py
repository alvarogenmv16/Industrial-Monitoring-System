from fastapi import APIRouter, Depends, HTTPException
from sqlite3 import Connection
from api.connector import get_db
from services import motor_service
from api.schemas import MotorTelemetry
from typing import List

router = APIRouter(prefix="/motors", tags=["Motors"])

@router.get("/", 
    response_model=List[int],
    responses = {
        200: {
            "description": "List of motor IDs in the database",
            "content": {
                "application/json": {
                    "example": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            },
        },

        404: {
            "description": "No motor IDs found",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "Failed to retrieve motor IDs from database"
                    }
                }
            },
        },
    }
)
async def get_motor_ids(db:Connection = Depends(get_db)):
    data = motor_service.get_motor_ids(db)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Failed to retrieve motor IDs from the database."
        )
    return data

@router.get("/{motor_id}/telemetry/latest", response_model=MotorTelemetry,
    responses = {
        200: {
            "description": "Retrieve motor stats",
            "content": {
                "application/json": {
                    "example":
                    {
                        "timestamp": "2025-01-1T01:11:11",
                        "machine_id": 1,
                        "temperature": 40,
                        "vibration": 40,
                        "pressure": 4,
                        "energy_consumption": 1,
                        "machine_status": 1,
                        "anomaly_flag": 0
                    }
                }
            },
        },
        404: {
            "description": "No motor data found for the specified ID",
            "content": {
                "application/json": {
                    "example": {
                        "detail": "No data found for motor with ID: 1"
                    }
                }
            },
        },
    },
)
async def get_motor_status(motor_id: int, db: Connection = Depends(get_db)):
    data = motor_service.get_motor_data(db, motor_id)

    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"No data found for motor with ID: {motor_id}"
        )

    return dict(data)   # Convert sqlite3.Row to a regular dictionary for Pydantic model parsing