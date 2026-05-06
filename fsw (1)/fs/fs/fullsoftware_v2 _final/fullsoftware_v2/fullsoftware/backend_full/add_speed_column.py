import sqlite3
import os

db_path = 'sampledb_v2.db'

def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(batches)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'batch_speed' not in columns:
        print("Adding 'batch_speed' column to batches table...")
        cursor.execute("ALTER TABLE batches ADD COLUMN batch_speed TEXT DEFAULT 'max'")
    else:
        print("'batch_speed' column already exists in batches table.")

    conn.commit()
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
