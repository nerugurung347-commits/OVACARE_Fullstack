import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def test_connection():
    """Test the database connection."""
    if not DATABASE_URL:
        print("Error: DATABASE_URL not found in environment variables")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result[0] == 1:
            print("Database connection successful")
        else:
            print("Database connection test returned unexpected result")
    except Exception as e:
        print(f"Database connection failed: {e}")


if __name__ == "__main__":
    test_connection()