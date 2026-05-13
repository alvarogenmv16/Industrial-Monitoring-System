from enum import Enum, IntEnum
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List

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

class MachineStatus(IntEnum):
    idle = 0
    running = 1
    failure = 2

class MotorStatus(BaseModel):
    machine_id: int
    status: MachineStatus
    anomaly: bool

class MotorSummary(BaseModel):
    idle: int
    running: int
    failure: int
    idle_with_anomaly: int
    running_with_anomaly: int
    failure_with_anomaly: int

class MotorOverviewResponse(BaseModel):
    motors: list[MotorStatus]
    summary: MotorSummary