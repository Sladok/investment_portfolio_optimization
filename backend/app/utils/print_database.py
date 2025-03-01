import clickhouse_connect
from fastapi import HTTPException

client = clickhouse_connect.get_client(host="localhost", port=8123)

# Вывод всех пользователей
rows = client.query("SELECT * FROM users").result_rows

if rows:
    print("Данные из таблицы users:")
    for row in rows:
        print(row)
else:
    print("Таблица users пустая.")