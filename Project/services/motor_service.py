from sqlite3 import Connection

def get_motor_data(db: Connection, machine_id: int):
    """
    Retrieves all motor data records from the database.
    
    Args:
        db (Connection): An active SQLite database connection.
        machine_id (int): The ID of the machine for which to retrieve data.
    """
    cursor = db.cursor()
    query = "SELECT * FROM motor_data WHERE machine_id = ? ORDER BY timestamp DESC"
    cursor.execute(query, (machine_id,))
    row = cursor.fetchone()
    return row