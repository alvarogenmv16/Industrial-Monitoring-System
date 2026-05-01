from sqlite3 import Connection
from typing import List, Optional

def get_motor_ids(db: Connection):
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

def get_motor_data(db: Connection, machine_id: int):
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

def get_motor_history(db: Connection, machine_id: int, start_time: Optional[str], end_time: Optional[str], limit: int = 1000):
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