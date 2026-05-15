import { useEffect, useState } from "react";
import {
  getMotors,
  getLatestMotor,
  getMotorHistory,
} from "./services/motors";
import TelemetryChart from "./components/TelemetryChart";

function App() {
  const [motors, setMotors] = useState<number[]>([]);
  const [selectedMotor, setSelectedMotor] = useState<number | null>(null);

  const [latest, setLatest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [metric, setMetric] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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

  const filteredHistory = history.filter((item) => {
    if (!startDate && !endDate) return true;

    const time = new Date(item.timestamp).getTime();

    if (startDate) {
      const start = new Date(startDate).getTime();
      if (time < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      if (time > end) return false;
    }

    return true;
  });

  return (
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
      {/* LEFT SIDE */}
      <div style={{ flex: 2 }}>
        <h1>Industrial Monitoring</h1>

        <h2>Select Motor</h2>

        <select
          value={selectedMotor ?? ""}
          onChange={(e) => setSelectedMotor(Number(e.target.value))}
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

        {/* NEW: metric selector */}
        <h2>Select Metric</h2>

        <select
          value={metric ?? ""}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="" disabled>
            -- Select a metric --
          </option>
          <option value="temperature">Temperature</option>
          <option value="vibration">Vibration</option>
          <option value="pressure">Pressure</option>
          <option value="energy_consumption">Energy Consumption</option>
        </select>
        
        <h3>Filter by date</h3>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <h3>History</h3>

        {metric && (
          <TelemetryChart data={filteredHistory} metric={metric} />
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ flex: 1 }}>
        <h2>Latest Data</h2>

        {latest ? (
          <div style={{ background: "#f5f5f5", padding: "10px" }}>
            <p><b>Temperature:</b> {latest.temperature}</p>
            <p><b>Vibration:</b> {latest.vibration}</p>
            <p><b>Pressure:</b> {latest.pressure}</p>
            <p><b>Energy:</b> {latest.energy_consumption}</p>
            <p><b>Status:</b> {latest.machine_status}</p>
            <p><b>Time:</b> {latest.timestamp}</p>
          </div>
        ) : (
          <p>No motor selected</p>
        )}
      </div>
    </div>
  );
}

export default App;