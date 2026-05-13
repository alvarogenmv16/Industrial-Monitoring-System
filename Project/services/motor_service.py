from sqlite3 import Connection
from typing import List, Optional
from collections import defaultdict
from api.schemas import (
    MotorOverviewResponse, 
    MotorStatus, 
    MotorSummary, 
    MachineStatus, 
    AnomalyEvent, 
    MotorAnomalyBreakdown, 
    GlobalSummary, 
    TimeWindow, 
    AnomalyOverviewResponse
)

STATUS_MAPPING = {
    0: MachineStatus.idle,
    1: MachineStatus.running,
    2: MachineStatus.failure
}

def get_motor_ids(
    db: Connection
):
    """
    Retrieves all motor ids from the database.
    
    Since the database randomly chooses 10 motors each time it is loaded
    
    Args:
        db (Connection): An active SQLite database connection
    """
    cursor = db.cursor()
    query = "SELECT DISTINCT machine_id FROM motor_data ORDER BY machine_id"
    cursor.execute(query)
    rows = cursor.fetchall()
    return [row["machine_id"] for row in rows]  # Return a list of machine_ids

def get_motor_data(
    db: Connection, 
    machine_id: int
):
    """
    Retrieves latest motor data records from the database.
    
    Args:
        db (Connection): An active SQLite database connection.
        machine_id (int): The ID of the machine for which to retrieve data.
    """
    cursor = db.cursor()
    query = "SELECT * FROM motor_data WHERE machine_id = ? ORDER BY timestamp DESC LIMIT 1"
    cursor.execute(query, (machine_id,))
    row = cursor.fetchone()
    return dict(row) if row else None

def get_motor_history(
    db: Connection, 
    machine_id: int, 
    start_time: Optional[str], 
    end_time: Optional[str], 
    limit: int = 1000
):
    cursor = db.cursor()
    query = "SELECT * FROM motor_data WHERE machine_id = ?"
    params: List[object] = [machine_id]

    if start_time:
        query += " AND timestamp >= ?"
        params.append(start_time)
    if end_time:
        query += " AND timestamp <= ?"
        params.append(end_time)
    query += " ORDER BY timestamp ASC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

def get_motor_status_overview(
    db: Connection
):
    cursor = db.cursor()
    query = """
        SELECT 
            md.machine_id,
            md.machine_status,
            md.anomaly_flag
        FROM motor_data md
        INNER JOIN(
            SELECT machine_id,
            MAX(timestamp) AS latest_timestamp
            FROM motor_data
            GROUP BY machine_id
        ) AS latest ON 
        md.machine_id = latest.machine_id 
        AND md.timestamp = latest.latest_timestamp
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    motor = []

    summary = {
        "idle":0,
        "running":0,
        "failure":0,
        "idle_with_anomaly":0,
        "running_with_anomaly":0,
        "failure_with_anomaly":0
    }

    for row in rows:
        status = MachineStatus(row["machine_status"])
        anomaly = bool(row["anomaly_flag"])

        motor.append(
            MotorStatus(
                machine_id=row["machine_id"],
                status=status,
                anomaly=anomaly
            )
        )

        # Count status
        if status == MachineStatus.idle:
            summary["idle"] += 1
            if anomaly:
                summary["idle_with_anomaly"] += 1
        elif status == MachineStatus.running:
            summary["running"] += 1
            if anomaly:
                summary["running_with_anomaly"] += 1
        elif status == MachineStatus.failure:
            summary["failure"] += 1
            if anomaly:
                summary["failure_with_anomaly"] += 1

    return MotorOverviewResponse(
        summary=MotorSummary(**summary),
        motors=motor
    )

def get_anomaly(
    db: Connection
) -> List[AnomalyEvent]:
    cursor = db.cursor()
    query = """
        SELECT 
            machine_id,
            timestamp,
            machine_status,
            anomaly_flag,
            failure_type
        FROM motor_data
        WHERE anomaly_flag = 1
        ORDER BY timestamp DESC
    """
    cursor.execute(query)
    rows = cursor.fetchall()

    events: List[AnomalyEvent] = []

    for row in rows:
        status = MachineStatus(row["machine_status"])

        events.append(
            AnomalyEvent(
                machine_id=row["machine_id"],
                timestamp=row["timestamp"],
                status=status,
                failure_type=row["failure_type"]
            )
        )
    return events

def get_anomaly_overview(
    db: Connection,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None
):

    cursor = db.cursor()

    query = """
        SELECT timestamp, machine_id, failure_type
        FROM motor_data
        WHERE anomaly_flag = 1
    """

    params: List[object] = []

    if start_time:
        query += " AND timestamp >= ?"
        params.append(start_time)

    if end_time:
        query += " AND timestamp <= ?"
        params.append(end_time)

    cursor.execute(query, params)
    rows = cursor.fetchall()

    # =========================
    # ANOMALY BREAKDOWN
    # =========================
    data = defaultdict(lambda: defaultdict(int))
    total_anomalies = 0

    for row in rows:

        machine_id = row["machine_id"]
        failure_type = row["failure_type"]

        data[machine_id][failure_type] += 1
        total_anomalies += 1

    motors = []

    for machine_id, failures in data.items():

        motors.append(
            MotorAnomalyBreakdown(
                machine_id=machine_id,
                total_anomalies=sum(failures.values()),
                by_failure_type=dict(failures)
            )
        )

    # =========================
    # TOP RISKY MACHINES
    # =========================
    motors_sorted = sorted(
        motors,
        key=lambda x: x.total_anomalies,
        reverse=True
    )

    top_risky_machines = [
        m.machine_id for m in motors_sorted[:5]
    ]

    # =========================
    # GLOBAL SUMMARY
    # =========================
    summary = GlobalSummary(
        total_anomalies=total_anomalies,
        unique_machines_affected=len(data)
    )

    # =========================
    # TIME WINDOW
    # =========================
    time_window = TimeWindow(
        start=start_time,
        end=end_time
    )

    return AnomalyOverviewResponse(
        time_window=time_window,
        global_summary=summary,
        top_risky_machines=top_risky_machines,
        motors=motors_sorted
    )