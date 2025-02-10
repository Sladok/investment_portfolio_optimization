import clickhouse_connect

# Подключение к серверу ClickHouse
client = clickhouse_connect.get_client(host='localhost', port=8123)

# Проверка соединения
print("Версия ClickHouse:", client.query('SELECT version()').result_rows)

# Создание таблицы, если она не существует
client.query('''
    CREATE TABLE IF NOT EXISTS users (
        id UInt32,
        name String,
        age UInt8
    ) ENGINE = MergeTree()
    ORDER BY id
''')
print("Таблица 'users' создана!")

# Вставка данных
client.query("INSERT INTO users VALUES (1, 'Alice', 25), (2, 'Bob', 30)")
print("Данные добавлены!")

# Выборка данных
rows = client.query("SELECT * FROM users").result_rows
print("Данные из таблицы:")
for row in rows:
    print(row)
