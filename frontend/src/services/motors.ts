import api from "./api";

// ===============
// MOTORS
// ===============

// Get all motors
export async function getMotors() {
  const res = await api.get("/motors/");
  return res.data;
}

// Latest motor data
export async function getLatestMotor(
  motorId: number,
  start_time?: string,
  end_time?: string
) {
  const res = await api.get(
    `/motors/${motorId}/telemetry/latest`,
    {
      params: {
        start_time,
        end_time,
      },
    }
  );

  return res.data;
}
// Historical motor data
export async function getMotorHistory(motorId: number) {
  const res = await api.get(`/motors/${motorId}/telemetry/history`);
  return res.data;
}

// ===============
// STATUS OVERVIEW
// ===============

export async function getMotorsStatusOverview(
  start_time?: string,
  end_time?: string
) {
  const res = await api.get("/motors/status/overview", {
    params: {
      start_time,
      end_time,
    },
  });

  return res.data;
}

// ===============
// ANOMALIES
// ===============

export async function getMotorAnomalies() {
  const res = await api.get("/motors/anomalies");
  return res.data;
}

export async function getMotorAnomaliesOverview(
  start_time?: string,
  end_time?: string
) {
  const res = await api.get("/motors/anomalies/overview", {
    params: {
      start_time,
      end_time,
    },
  });

  return res.data;
}