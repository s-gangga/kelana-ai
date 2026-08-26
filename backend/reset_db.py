from backend.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    connection.execute(text("TRUNCATE TABLE trips RESTART IDENTITY;"))
    connection.commit()
    print("✅ Tabel trips berhasil dibersihkan dan ID di-reset ke 1!")