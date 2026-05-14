import { useEffect, useState } from "react";
import { getMotors } from "./services/motors";

function App() {
  const [motors, setMotors] = useState<number[]>([]);
  const [selectedMotor, setSelectedMotor] = useState<number | null>(null);

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

  return (
    <div>
      <h1>Industrial Monitoring</h1>

      <h2>Motors:</h2>

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

      {selectedMotor && (
        <p>Selected Motor ID: {selectedMotor}</p>
      )}
    </div>
  );
}

export default App;