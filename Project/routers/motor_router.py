from fastapi import APIRouter, Depends, HTTPException
from sqlite3 import Connection
from api.connector import get_db
from services import motor_service
from api.schemas import MotorTelemetry

router = APIRouter(prefix="/machines", tags=["Industrial Monitoring"])

@router.get("/{machine_id}/latest", response_model=MotorTelemetry)
async def get_machine_status(machine_id: int, db: Connection = Depends(get_db)):
    data = motor_service.get_motor_data(db, machine_id)
    
    if not data:
        raise HTTPException(
            status_code=404, 
            detail=f"No se han encontrado datos para la máquina {machine_id}"
        )

    return dict(data)   # Convert sqlite3.Row to a regular dictionary for Pydantic model parsing