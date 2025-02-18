














# import clickhouse_connect

# # Подключение к серверу ClickHouse
# client = clickhouse_connect.get_client(host='localhost', port=8123)

# print("Версия ClickHouse:", client.query('SELECT version()').result_rows)

# # Вывод всех пользователей
# rows = client.query("SELECT * FROM users").result_rows

# if rows:
#     print("Данные из таблицы users:")
#     for row in rows:
#         print(row)
# else:
#     print("Таблица users пустая.")

