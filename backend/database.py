import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def get_connection():
    """Create and return a database connection."""
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL not found in environment variables")
    conn = psycopg2.connect(DATABASE_URL)
    return conn


def init_database():
    """Initialize the database by running the setup SQL script."""
    sql_file_path = os.path.join(os.path.dirname(__file__), "setup_database.sql")

    with open(sql_file_path, "r") as f:
        sql_script = f.read()

    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql_script)
        conn.commit()
        cursor.close()
        print("Database initialization completed successfully")
    except Exception as e:
        conn.rollback()
        print(f"Database initialization failed: {e}")
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    init_database()