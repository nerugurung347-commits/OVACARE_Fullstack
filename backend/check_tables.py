import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

TABLES_TO_CHECK = ["profiles", "cycle_data", "preferences"]


def check_tables():
    """Check that all required tables exist in the database."""
    if not DATABASE_URL:
        print("Error: DATABASE_URL not found in environment variables")
        return

    conn = psycopg2.connect(DATABASE_URL)
    try:
        cursor = conn.cursor()

        for table_name in TABLES_TO_CHECK:
            cursor.execute(
                """
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public'
                    AND table_name = %s
                );
                """,
                (table_name,)
            )
            exists = cursor.fetchone()[0]
            if exists:
                print(f"Table found: {table_name}")
            else:
                print(f"Table NOT found: {table_name}")

        cursor.close()
    except Exception as e:
        print(f"Error checking tables: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    check_tables()