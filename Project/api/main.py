from fastapi import FastAPI
import sqlite3
from typing import List

def get_db_connection():
    conn = sqlite3.connect("motor.db")
    return conn
# -----------------------------
#           API Setup
# -----------------------------

app = FastAPI(
    title="Industrial Monitoring System API",
    description="API for real-time monitoring, processing, and secure exposure of industrial machinery data.",
    version="1.0.0"
)

# -----------------------------
#      Database Connection
# -----------------------------

# Database path
DB_path = r"Database\industrial_data.db"

# Function to connect to database
def get_db_connection():
    conn = sqlite3.connect(DB_path)
    conn.row_factory = sqlite3.Row
    return conn

# Test endpoint
@app.get("/")
async def first_api():
    return {"message": "Welcome to the Industrial Monitoring System API!"}

# Test endpoint for database
@app.get("/machines", response_model=List[str])
def get_machines():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT DISTINCT machine_id FROM motor_data")
    rows = cursor.fetchall()

    conn.close()

    machines = [str(row["machine_id"]) for row in rows if row["machine_id"] is not None]

    return machines