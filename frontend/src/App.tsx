import { useEffect, useState } from "react";
import { getMotors } from "./services/motors";

function App() {
  const [motors, setMotors] = useState<number[]>([]);

  useEffect(() => {
    async function loadMotors() {
      try {
        const data = await getMotors();
        setMotors(data.motor_ids);
      } catch (err) {
        console.error("Error cargando motores:", err);
      }
    }

    loadMotors();
  }, []);

  return (
    <div>
      <h1>Industrial Monitoring</h1>

      <h2>Motors:</h2>

      <ul>
        {motors.map((m) => (
          <li key={m}>Motor {m}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;