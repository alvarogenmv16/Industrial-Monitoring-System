import api from "./api";

// Get all motors
export async function getMotors() {
  const res = await api.get("/motors/");
  return res.data;
}

// Latest motor data
export async function getLatestMotor(motorId: number) {
  const res = await api.get(`/motors/${motorId}/telemetry/latest`);
  return res.data;
}

// Historical motor data
export async function getMotorHistory(motorId: number) {
  const res = await api.get(`/motors/${motorId}/telemetry/history`);
  return res.data;
}