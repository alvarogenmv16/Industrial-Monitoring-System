from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MotorTelemetry(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    timestamp: datetime
    machine_id: int
    temperature: float
    vibration: float
    pressure: float
    energy_consumption: float
    machine_status: int
    anomaly_flag: int
