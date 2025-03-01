import clickhouse_connect
from fastapi import HTTPException

client = clickhouse_connect.get_client(host="localhost", port=8123)

client.query('''
    CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT generateUUIDv4(),
        email String,
        hashed_password String
    ) ENGINE = ReplacingMergeTree()
    ORDER BY email
''')


# client.query(f"ALTER TABLE users DELETE WHERE email = 'alexander.130@bk.ru'")

def get_user_by_email(email: str):
    """Получить хешированный пароль пользователя по email"""
    result = client.query(f"SELECT hashed_password FROM users WHERE email = '{email}'").result_rows
    return result[0][0] if result else None


def create_user(email: str, hashed_password: str):
    """Создать нового пользователя"""
    existing = client.query(f"SELECT count() FROM users WHERE email = '{email}'").result_rows[0][0]
    if existing > 0:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    client.query(f"INSERT INTO users (email, hashed_password) VALUES ('{email}', '{hashed_password}')")


def delete_user(email: str):
    """Удалить пользователя по email"""
    print(email)
    existing = client.query(f"SELECT count() FROM users WHERE email = '{email}'").result_rows[0][0]
    if existing == 0:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    client.query(f"ALTER TABLE users DELETE WHERE email = '{email}'")
    return {"message": "Аккаунт успешно удалён"}

print("Версия ClickHouse:", client.query('SELECT version()').result_rows)


# Вывод всех пользователей
rows = client.query("SELECT * FROM users").result_rows

if rows:
    print("Данные из таблицы users:")
    for row in rows:
        print(row)
else:
    print("Таблица users пустая.")

