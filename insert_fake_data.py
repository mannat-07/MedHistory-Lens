import sqlite3
import datetime

conn = sqlite3.connect('backend/medhistory.db')
cur = conn.cursor()

# Check user 1 exists, insert fake data
try:
    cur.execute("""
        INSERT INTO health_metrics (user_id, test_date, wbc, rbc, hemoglobin, platelets, glucose, hba1c, ldl_cholesterol, hdl_cholesterol, total_cholesterol) 
        VALUES (5, ?, 6.5, 4.8, 14.5, 250, 95.0, 5.2, 110.0, 50.0, 180.0)
    """, (datetime.date.today().isoformat(),))
    conn.commit()
    print("Inserted health metrics!")
except Exception as e:
    print(f"Error: {e}")

cur.execute("SELECT * FROM health_metrics WHERE user_id = 5 ORDER BY id DESC LIMIT 1")
print(cur.fetchone())
conn.close()
