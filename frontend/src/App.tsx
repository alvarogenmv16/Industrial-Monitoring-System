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

function App() {
  // ======================
  // STATE
  // ======================

  const [motors, setMotors] = useState<number[]>([]);
  const [selectedMotor, setSelectedMotor] = useState<number | null>(null);

  const [latest, setLatest] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [metric, setMetric] = useState<string | null>(null);

  const [range, setRange] = useState<number[]>([0, 100]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // STATUS + ANOMALIES
  const [statusOverview, setStatusOverview] =
    useState<any>(null);

  const [anomaliesOverview, setAnomaliesOverview] =
    useState<any>(null);

  const [anomalies, setAnomalies] = useState<any[]>(
    []
  );

  // ======================
  // LOAD MOTORS
  // ======================

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

  // ======================
  // LOAD MOTOR DATA
  // ======================

  useEffect(() => {
    if (selectedMotor === null) return;

    const motorID = selectedMotor;
    
    async function loadMotorData() {
      try {
        const latestData = await getLatestMotor(
          motorID
        );

        const historyData = await getMotorHistory(
          motorID
        );

        setLatest(latestData);
        setHistory(historyData);

        // Reset slider range
        setRange([0, historyData.length - 1]);
      } catch (err) {
        console.error(
          "Error loading motor data:",
          err
        );
      }
    }

    loadMotorData();
  }, [selectedMotor]);

  // ======================
  // LOAD STATUS OVERVIEW
  // ======================

  useEffect(() => {
  async function loadStatus() {
    try {
      const data = await getMotorsStatusOverview(
        startDate || undefined,
        endDate || undefined
      );

      setStatusOverview(data);
    } catch (err) {
      console.error(err);
    }
  }

  loadStatus();
  }, [startDate, endDate]);

  // ======================
  // LOAD ANOMALIES
  // ======================

  useEffect(() => {
    async function loadAnomalies() {
      try {
        const data = await getMotorAnomalies();
        setAnomalies(data);
      } catch (err) {
        console.error(
          "Error loading anomalies:",
          err
        );
      }
    }

    loadAnomalies();
  }, []);

  // ======================
  // LOAD ANOMALIES OVERVIEW
  // ======================

  useEffect(() => {
    async function loadAnomaliesOverview() {
      try {
        const data =
          await getMotorAnomaliesOverview(
            startDate || undefined,
            endDate || undefined
          );

        setAnomaliesOverview(data);
      } catch (err) {
        console.error(
          "Error loading anomalies overview:",
          err
        );
      }
    }

    loadAnomaliesOverview();
  }, [startDate, endDate]);

  // ======================
  // SYNC DATE FILTERS
  // ======================

  useEffect(() => {
    if (!history.length) return;

    let start = 0;
    let end = history.length - 1;

    if (startDate) {
      const startIndex = findClosestIndex(
        startDate
      );

      if (startIndex !== -1) {
        start = startIndex;
      }
    }

    if (endDate) {
      const endIndex = findClosestIndex(
        endDate
      );

      if (endIndex !== -1) {
        end = endIndex;
      }
    }

    setRange([start, end]);
  }, [startDate, endDate, history]);

  // ======================
  // FILTERED HISTORY
  // ======================

  const filteredHistory = history.slice(
    range[0],
    range[1] + 1
  );

  const filteredAnomalies = anomalies.filter(
  (a: any) => {
    // Remove "Normal"
    if (a.failure_type === "Normal") {
      return false;
    }

    // No date filters active
    if (!startDate && !endDate) {
      return true;
    }

    const anomalyDate = a.timestamp.slice(0, 10);

    // Start only
    if (startDate && !endDate) {
      return anomalyDate >= startDate;
    }

    // End only
    if (!startDate && endDate) {
      return anomalyDate <= endDate;
    }

    // Both
    return (
      anomalyDate >= startDate &&
      anomalyDate <= endDate
    );
  }
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
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
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
              setSelectedMotor(
                e.target.value
                  ? Number(e.target.value)
                  : null
              )
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
              setMetric(
                e.target.value || null
              )
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

        {/* TIME RANGE */}
        <div
          style={{
            minWidth: "350px",
            maxWidth: "600px",
            flex: 1,
          }}
        >
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
            onChange={(value) => {
              const newRange = value as number[];

              setRange(newRange);

              // Sync dates with slider
              const startItem = history[newRange[0]];
              const endItem = history[newRange[1]];

              if (startItem) {
                setStartDate(
                  startItem.timestamp.slice(0, 10)
                );
              }

              if (endItem) {
                setEndDate(
                  endItem.timestamp.slice(0, 10)
                );
              }
            }}
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
            <p>
              Select a metric to display the
              chart.
            </p>
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
                <b>Temperature:</b>{" "}
                {latest.temperature}
              </p>

              <p>
                <b>Vibration:</b>{" "}
                {latest.vibration}
              </p>

              <p>
                <b>Pressure:</b>{" "}
                {latest.pressure}
              </p>

              <p>
                <b>Energy:</b>{" "}
                {
                  latest.energy_consumption
                }
              </p>

              <p>
                <b>Status:</b>{" "}
                {latest.machine_status}
              </p>

              <p>
                <b>Time:</b>{" "}
                {latest.timestamp}
              </p>
            </div>
          ) : (
            <p style={{ color: colors.text }}>
              No motor selected
            </p>
          )}
        </div>
      </div>

      {/* STATUS + RECENT ANOMALIES */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {/* STATUS OVERVIEW */}
        <div
          style={{
            flex: 1,
            background: colors.panel,
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2>Status Overview</h2>

          {statusOverview?.summary && (
            <>
              {/* KPI GRID */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    background: colors.background,
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    Running
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      color: "#52c41a",
                    }}
                  >
                    {
                      statusOverview.summary
                        .running
                    }
                  </div>
                </div>

                <div
                  style={{
                    background: colors.background,
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    Failure
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      color: "#ff4d4f",
                    }}
                  >
                    {
                      statusOverview.summary
                        .failure
                    }
                  </div>
                </div>

                <div
                  style={{
                    background: colors.background,
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    Running + Anomaly
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      color: "#faad14",
                    }}
                  >
                    {
                      statusOverview.summary
                        .running_with_anomaly
                    }
                  </div>
                </div>

                <div
                  style={{
                    background: colors.background,
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    Idle
                  </div>

                  <div
                    style={{
                      fontSize: "24px",
                      color: "#8c8c8c",
                    }}
                  >
                    {
                      statusOverview.summary
                        .idle
                    }
                  </div>
                </div>
              </div>

              {/* MACHINE LIST */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: "350px",
                  overflowY: "auto",
                }}
              >
                {statusOverview.motors.map(
                  (m: any) => (
                    <div
                      key={m.machine_id}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        background: colors.background,
                        padding: "10px",
                        borderRadius: "6px",
                      }}
                    >
                      <span>
                        Machine {m.machine_id}
                      </span>

                      <span>
                        {m.status === 1 &&
                          "🟢 Running"}

                        {m.status === 2 &&
                          "🔴 Failure"}

                        {m.status === 0 &&
                          "⚪ Idle"}

                        {m.anomaly && " ⚠"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* RECENT ANOMALIES */}
        <div
          style={{
            flex: 1,
            background: colors.panel,
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2>Recent Anomalies</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {filteredAnomalies
              .slice(0, 15)
              .map((a: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    background: "#262626",
                    padding: "12px",
                    borderRadius: "8px",
                    borderLeft:
                      "4px solid #ff4d4f",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <strong>
                      Machine {a.machine_id}
                    </strong>

                    <span
                      style={{
                        fontSize: "12px",
                        opacity: 0.7,
                      }}
                    >
                      {new Date(
                        a.timestamp
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    Status:{" "}
                    {a.status === 1
                      ? "Running"
                      : "Failure"}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "13px",
                      color: "#faad14",
                    }}
                  >
                    Failure Type:{" "}
                    {a.failure_type}
                  </div>
                </div>
              ))}
          </div>
        </div>
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
            <div
              style={{
                marginBottom: "15px",
                fontSize: "12px",
                opacity: 0.8,
              }}
            >
              📅{" "}
              {
                anomaliesOverview.time_window
                  .start
              }{" "}
              →
              {" "}
              {
                anomaliesOverview.time_window
                  .end
              }
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
                <b>
                  {
                    anomaliesOverview
                      .global_summary
                      .total_anomalies
                  }
                </b>
              </div>

              <div>
                🏭 Machines affected:{" "}
                <b>
                  {
                    anomaliesOverview
                      .global_summary
                      .unique_machines_affected
                  }
                </b>
              </div>
            </div>

            {/* TOP RISK MACHINES */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <h3>Top Risk Machines</h3>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {anomaliesOverview.top_risky_machines.map(
                  (id: string) => (
                    <span
                      key={id}
                      style={{
                        padding: "6px 10px",
                        background:
                          "#ff4d4f",
                        borderRadius: "6px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {id}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* MACHINE BREAKDOWN */}
            <div>
              <h3>Machine Breakdown</h3>

              {anomaliesOverview.motors.map(
                (m: any) => (
                  <div
                    key={m.machine_id}
                    style={{
                      padding: "10px",
                      borderBottom:
                        "1px solid #2a2a2a",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <b>{m.machine_id}</b>

                      <span>
                        Total:{" "}
                        {
                          m.total_anomalies
                        }
                      </span>
                    </div>

                    {/* FAILURE TYPES */}
                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {Object.entries(
                        m.by_failure_type
                      ).map(
                        (
                          [type, count]: any
                        ) => (
                          <span
                            key={type}
                            style={{
                              fontSize:
                                "12px",
                              padding:
                                "4px 8px",
                              background:
                                "#333",
                              borderRadius:
                                "5px",
                            }}
                          >
                            {type}: {count}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;