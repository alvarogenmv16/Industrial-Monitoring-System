import { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  getMotors,
  getLatestMotor,
  getMotorHistory,
  getMotorsStatusOverview,
  getMotorAnomalies,
  getMotorAnomaliesOverview,
} from "./services/motors";
import TelemetryChart from "./components/TelemetryChart";
import { colors } from "./theme/colors";

// States
function App() {
  const [motors, setMotors] = useState<number[]>([]);
  const [selectedMotor, setSelectedMotor] = useState<number | null>(null);

  const [latest, setLatest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [metric, setMetric] = useState<string | null>(null);

  const [range, setRange] = useState<number[]>([0, 100]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // STATUS + ANOMALIES
  const [statusOverview, setStatusOverview] = useState<any>(null);
  const [anomaliesOverview, setAnomaliesOverview] = useState<any>(null);

  // Load motors on mount
  useEffect(() => {
    async function loadMotors() {
      try {
        const data = await getMotors();
        setMotors(data.motor_ids);
      } catch (err) {
        console.error("Error loading motors:", err);
      }
    }

    loadMotors();
  }, []);

  // Load latest and history when selectedMotor changes
  useEffect(() => {
    if (selectedMotor === null) return;

    const motorId = selectedMotor;

    async function loadMotorData() {
      try {
        const latestData = await getLatestMotor(motorId);
        const historyData = await getMotorHistory(motorId);

        setLatest(latestData);
        setHistory(historyData);
      } catch (err) {
        console.error("Error loading motor data:", err);
      }
    }

    loadMotorData();
  }, [selectedMotor]);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await getMotorsStatusOverview();
        setStatusOverview(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadStatus();
  }, []);

  useEffect(() => {
    if (!history.length) return;

    let start = 0;
    let end = history.length - 1;

    if (startDate) {
      const startIndex = findClosestIndex(startDate);

      if (startIndex !== -1) {
        start = startIndex;
      }
    }

    if (endDate) {
      const endIndex = findClosestIndex(endDate);

      if (endIndex !== -1) {
        end = endIndex;
      }
    }

    setRange([start, end]);
  }, [startDate, endDate]);

  useEffect(() => {
  async function loadAnomaliesOverview() {
    try {
      const data = await getMotorAnomaliesOverview(
        startDate || undefined,
        endDate || undefined
      );

      setAnomaliesOverview(data);
    } catch (err) {
      console.error("Error loading anomalies overview:", err);
    }
  }

  loadAnomaliesOverview();
}, [startDate, endDate]);

  // NEW: filter using slider indices
  const filteredHistory = history.slice(
    range[0],
    range[1] + 1
  );

  function findClosestIndex(date: string) {
    return history.findIndex((item) =>
      item.timestamp.startsWith(date)
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        background: colors.background,
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div>
        <h1 style={{ color: colors.text }}>
          Industrial Monitoring Dashboard
        </h1>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          background: colors.panel,
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* MOTOR SELECT */}
        <div>
          <label style={{ color: colors.text }}>
            <b>Motor</b>
          </label>
          <br />

          <select
            value={selectedMotor ?? ""}
            onChange={(e) =>
              setSelectedMotor(Number(e.target.value))
            }
          >
            <option value="" disabled>
              -- Select a motor --
            </option>

            {motors.map((m) => (
              <option key={m} value={m}>
                Motor {m}
              </option>
            ))}
          </select>
        </div>

        {/* METRIC SELECT */}
        <div>
          <label style={{ color: colors.text }}>
            <b>Metric</b>
          </label>
          <br />

          <select
            value={metric ?? ""}
            onChange={(e) =>
              setMetric(e.target.value)
            }
          >
            <option value="" disabled>
              -- Select a metric --
            </option>

            <option value="temperature">
              Temperature
            </option>
            <option value="vibration">
              Vibration
            </option>
            <option value="pressure">
              Pressure
            </option>
            <option value="energy_consumption">
              Energy Consumption
            </option>
          </select>
        </div>

        {/* TIME RANGE SLIDER */}
        <div style={{ minWidth: "350px", maxWidth: "600px", flex: 1 }}>
          <label style={{ color: colors.text }}>
            <b>Time Window</b>
          </label>

          <p
            style={{
              marginTop: "5px",
              fontSize: "14px",
              color: colors.textSecondary,
              textAlign: "center",
            }}
          >
            {history[range[0]]
              ? new Date(
                  history[range[0]].timestamp
                ).toLocaleDateString()
              : "-"}

            {"  →  "}

            {history[range[1]]
              ? new Date(
                  history[range[1]].timestamp
                ).toLocaleDateString()
              : "-"}
          </p>

          <Slider
            range
            min={0}
            max={Math.max(history.length - 1, 0)}
            value={range}
            onChange={(value) =>
              setRange(value as number[])
            }
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            flex: 2,
            background: colors.panel,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Telemetry History</h2>

          {metric ? (
            <TelemetryChart
              data={filteredHistory}
              metric={metric}
            />
          ) : (
            <p>Select a metric to display the chart.</p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            background: colors.panel,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Latest Data</h2>

          {latest ? (
            <div>
              <p>
                <b>Temperature:</b> {latest.temperature}
              </p>
              <p>
                <b>Vibration:</b> {latest.vibration}
              </p>
              <p>
                <b>Pressure:</b> {latest.pressure}
              </p>
              <p>
                <b>Energy:</b> {latest.energy_consumption}
              </p>
              <p>
                <b>Status:</b> {latest.machine_status}
              </p>
              <p>
                <b>Time:</b> {latest.timestamp}
              </p>
            </div>
          ) : (
            <p style={{ color: colors.text }}>
              No motor selected
            </p>
          )}
        </div>
      </div>

      {/* STATUS OVERVIEW */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: colors.panel,
          borderRadius: "10px",
        }}
      >
        <h2>Status Overview</h2>

        {statusOverview?.summary && (
          <div>
            <div>Idle: {statusOverview.summary.idle}</div>
            <div>Running: {statusOverview.summary.running}</div>
            <div>Failure: {statusOverview.summary.failure}</div>
          </div>
        )}

        {statusOverview?.motors?.map((m: any) => (
          <div key={m.machine_id}>
            Machine {m.machine_id} - {m.status}
            {m.anomaly && " ⚠"}
          </div>
        ))}
      </div>

      {/* ANOMALIES OVERVIEW */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          background: colors.panel,
          borderRadius: "10px",
        }}
      >
        <h2>Anomalies Overview</h2>

        {!anomaliesOverview ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* TIME WINDOW */}
            <div style={{ marginBottom: "15px", fontSize: "12px", opacity: 0.8 }}>
              📅 {anomaliesOverview.time_window.start} →{" "}
              {anomaliesOverview.time_window.end}
            </div>

            {/* GLOBAL KPIs */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                🔥 Total anomalies:{" "}
                <b>{anomaliesOverview.global_summary.total_anomalies}</b>
              </div>

              <div>
                🏭 Machines affected:{" "}
                <b>
                  {anomaliesOverview.global_summary.unique_machines_affected}
                </b>
              </div>
            </div>

            {/* TOP RISK MACHINES */}
            <div style={{ marginBottom: "20px" }}>
              <h3>Top Risk Machines</h3>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {anomaliesOverview.top_risky_machines.map((id: string) => (
                  <span
                    key={id}
                    style={{
                      padding: "6px 10px",
                      background: "#ff4d4f",
                      borderRadius: "6px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>

            {/* MACHINE BREAKDOWN */}
            <div>
              <h3>Machine Breakdown</h3>

              {anomaliesOverview.motors.map((m: any) => (
                <div
                  key={m.machine_id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #2a2a2a",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <b>{m.machine_id}</b>
                    <span>Total: {m.total_anomalies}</span>
                  </div>

                  {/* FAILURE TYPES */}
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {Object.entries(m.by_failure_type).map(
                      ([type, count]: any) => (
                        <span
                          key={type}
                          style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            background: "#333",
                            borderRadius: "5px",
                          }}
                        >
                          {type}: {count}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;