# import clickhouse_connect
# from fastapi import HTTPException
 
# client = clickhouse_connect.get_client(host="localhost", port=8123)

# # Вывод всех пользователей
# rows = client.query("SELECT * FROM portfolios").result_rows

# # rows = client.query("SELECT * FROM portfolio_stocks").result_rows
# # client.query("DROP TABLE IF EXISTS portfolios")
# if rows:
#     print("Данные из таблицы users:")
#     for row in rows:
#         print(row)
# else:
#     print("Таблица users пустая.")
from tvDatafeed import TvDatafeed
name = "sladok2022@gmail.com"
PS = "Qjn#k:&RG(n+p4c"
# session = "r1gs3ub4zq011r81oe41gk8vuippje5m"
# token = "666e2fea-951d-4726-bc0c-f651eda046c5"
tv = TvDatafeed(username=name, password=PS)
# tv.token = token
# tv.session = session
results = tv.search_symbol('AAPL', 'NASDAQ')
for result in results:
    print(result)
# print(tv.token)