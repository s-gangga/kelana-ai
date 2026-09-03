from backend.database import engine, Base
import backend.models as models

def reset_database():
    print("Mengeksekusi drop table PostgreSQL...")
    # 1. Hapus semua tabel lama (termasuk skema lama tanpa user_category)
    Base.metadata.drop_all(bind=engine)
    
    print("Membuat ulang tabel dengan skema baru...")
    # 2. Buat ulang tabel baru dengan kolom user_category
    Base.metadata.create_all(bind=engine)
    
    print("Database PostgreSQL berhasil di-reset 100%!")

if __name__ == "__main__":
    reset_database()