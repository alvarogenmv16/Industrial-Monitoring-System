import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TelemetryPoint {
  timestamp: string;
  temperature: number;
  vibration: number;
  pressure: number;
  energy_consumption: number;
}

interface Props {
  data: TelemetryPoint[];
}

export default function TelemetryChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => {
              const date = new Date(value);

              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit"
              });
            }}
            tick= {{fontSize:12}}
            minTickGap={30}
          />

          <YAxis 
            unit = "°C"
            tick= {{fontSize:12}}
          />
                
          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleString()
            }
          />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}