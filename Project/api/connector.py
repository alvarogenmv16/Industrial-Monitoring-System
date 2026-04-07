import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_path = BASE_DIR / "Database" / "industrial_data.db"

def get_db():
    """
    Generator function that creates and manages database connections.
    
    This function is designed to work as a FastAPI dependency, providing automatic
    database connection management with guaranteed cleanup.
    
    Yields:
        sqlite3.Connection: An active SQLite database connection configured for row access
    """
    # check_same_thread=False allows the connection to be used across multiple threads
    conn = sqlite3.connect(DB_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row  # Instead of default tuples, set row factory to return query results as Row objects
    try:
        yield conn
    finally:
        conn.close()