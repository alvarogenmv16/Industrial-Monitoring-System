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
  metric: string;
}

const metricConfig: Record<
  string,
  { label: string; unit: string; color: string }
> = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    color: "#ef4444",
  },
  vibration: {
    label: "Vibration",
    unit: "mm/s",
    color: "#3b82f6",
  },
  pressure: {
    label: "Pressure",
    unit: "bar",
    color: "#10b981",
  },
  energy_consumption: {
    label: "Energy",
    unit: "kWh",
    color: "#f59e0b",
  },
};

export default function TelemetryChart({
  data,
  metric,
}: Props) {
  const config =
    metricConfig[metric] || metricConfig.temperature;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => {
              const date = new Date(value);

              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
              });
            }}
            tick={{ fontSize: 12 }}
            minTickGap={30}
            label={{
              value: "Date",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            unit={config.unit}
            tick={{ fontSize: 12 }}
            label={{
              value: `${config.label} (${config.unit})`,
              angle: -90,
              position: "insideLeft",
              dx: -10,
              style: {
                textAnchor: "middle",
              },
            }}
          />

          <Tooltip
            labelFormatter={(value) =>
              new Date(value).toLocaleString("es-ES")
            }
            formatter={(value: any) => {
              if (value === undefined || value === null) {
                return ["-", config.label];
            }

              return [`${value} ${config.unit}`, config.label];
            }}
          />

          <Line
            type="monotone"
            dataKey={metric}
            stroke={config.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}