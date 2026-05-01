from fastapi import APIRouter, Depends, HTTPException
from sqlite3 import Connection
from api.connector import get_db
from services import motor_service
from responses import motor_responses
from api.schemas import MotorTelemetry
from typing import List, Optional

router = APIRouter(prefix="/motors", tags=["Motors"])

@router.get("/", 
    response_model=List[int],
    responses = motor_responses.motor_ids_response,
    summary = "Get all motor IDs",
    description = """
        Retrieve all motor IDs currently stored in the system.

        ### Notes
        - Returns an empty list if no motors are available.
        - Does not include telemetry data.

        ### Example usage
        Frontend loads this endpoint to allow users to select a motor.
    """,
)
async def get_motor_ids(
    db:Connection = Depends(get_db)
):
    data = motor_service.get_motor_ids(db)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail=f"Failed to retrieve motor IDs from the database."
        )
    return data

@router.get("/{motor_id}/telemetry/latest", 
    response_model=MotorTelemetry,
    responses = motor_responses.motor_telemetry_response,
    summary = "Get latest telemetry data",
    description = """
        Retrieve the most recent telemetry data for a specific motor.

        ### Includes
        - Temperature
        - Vibration
        - Pressure
        - Energy consumption
        - Machine status
        - Anomaly flag

        ### Behavior
        - Returns the most recent record available.
        - Returns **404** if the motor does not exist or has no data.

        ### Example
        Used to update live metrics in a monitoring UI.
    """,    
)
async def get_motor_status(
    motor_id: int, 
    db: Connection = Depends(get_db)
):
    data = motor_service.get_motor_data(db, motor_id)

    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"No data found for motor with ID: {motor_id}"
        )

    return dict(data)   # Convert sqlite3.Row to a regular dictionary for Pydantic model parsing

@router.get("/{motor_id}/telemetry/history", 
    response_model=List[MotorTelemetry],
    responses = motor_responses.motor_telemetry_response,
    summary = "Get the historical data for a given motor ID",
    description = """
    Retrieve the historical telemetry data for a specific motor.
    
    ### Query parameters
    - start_time: beginning of range (Optional)
    - end_time: end of range (Optional)

    ### Behavior
    - Returns the historical records from oldest to newest
    - Returns **404** if the motor does not exist or has no data.

    ### Example
    Used to update live metrics in a monitoring UI.
    """,
)
async def get_motor_history(
    motor_id: int, 
    start_time: Optional[str] = None, 
    end_time: Optional[str] = None,
    db: Connection = Depends(get_db),
):
    data = motor_service.get_motor_history(db = db, machine_id = motor_id, start_time = start_time, end_time = end_time)

    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No historical data found for motor with ID: {motor_id}"
        )

    return data
