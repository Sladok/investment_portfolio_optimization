
from polygon import RESTClient

client = RESTClient("p48swIcpTMhDi4LE6dRlRQf_xpj65mjk")

aggs = []
for a in client.list_aggs(
    "AAPL",
    1,
    "day",  # Изменено с "minute" на "day"
    "2025-01-01",
    "2025-02-03",
    limit=50000,
):
    aggs.append(a)


print(aggs)

# import asyncio
# import json
# import websockets
# import requests

# API_KEY = "6EC4Y86BGTEISERR"
# SYMBOL = "AAPL"  # Тикер акции
# URL = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={SYMBOL}&apikey={API_KEY}"

# async def stock_price(websocket, path=0):
#     while True:
#         response = requests.get(URL).json()
#         try:
#             price = float(response["Global Quote"]["05. price"])
#             await websocket.send(json.dumps({"ticker": SYMBOL, "price": price}))
#         except KeyError:
#             print("Ошибка в данных API:", response)
        
#         await asyncio.sleep(5)  # Обновляем каждые 5 секунд

# import asyncio
# import websockets

# async def main():
#     start_server = await websockets.serve(stock_price, "127.0.0.1", 8000)
#     await start_server.wait_closed()

# asyncio.run(main())  # Используем asyncio.run() для запуска цикла событий



