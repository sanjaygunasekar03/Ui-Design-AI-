import sqlite3
import os

db_path = 'c:/Users/Sanjayarya/Downloads/fullsoftware_v2 _final/fullsoftware_v2/fullsoftware/backend_full/sampledb_v2.db'

def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check for status column in templates table
    cursor.execute("PRAGMA table_info(templates)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'status' not in columns:
        print("Adding 'status' column to templates table...")
        cursor.execute("ALTER TABLE templates ADD COLUMN status TEXT DEFAULT 'Active'")
    else:
        print("'status' column already exists in templates table.")

    # Update any existing templates to have 'Active' status if they don't have one
    cursor.execute("UPDATE templates SET status = 'Active' WHERE status IS NULL")

    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
