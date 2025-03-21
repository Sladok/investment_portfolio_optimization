import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from polygon import RESTClient

API_KEY = "p48swIcpTMhDi4LE6dRlRQf_xpj65mjk"



router = APIRouter()

@router.websocket("/ws/stock/{symbol}")
async def websocket_stock(websocket: WebSocket, symbol: str):
    await websocket.accept()
    client = RESTClient(API_KEY)

    try:
        while True:
            # Получаем последнюю минутную свечу
            aggs = list(client.list_aggs(symbol, 1, "minute", "2024-02-14", "2024-02-14", limit=2))

            if not aggs:
                await websocket.send_text(json.dumps({"error": "Нет данных"}))
                await asyncio.sleep(5)
                continue

            last = aggs[-1]
            previous = aggs[-2] if len(aggs) >= 2 else last
            change = last.close - previous.close

            data = {
                "symbol": symbol.upper(),
                "price": round(last.close, 2),
                "change": round(change, 2)
            }
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(5)  # Запрос каждые 5 секунд
    except WebSocketDisconnect:
        print(f"WebSocket connection for {symbol} closed")


# import asyncio
# import json
# from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
# import yfinance as yf

# router = APIRouter()

# @router.websocket("/ws/stock/{symbol}")
# async def websocket_stock(websocket: WebSocket, symbol: str):
#     await websocket.accept()
#     try:
#         # Бесконечный цикл обновления данных
#         while True:
#             stock = yf.Ticker(symbol)
#             # Получаем данные с интервалом 1m за текущий день
#             history = stock.history(period="1d", interval="1m")
#             if history.empty:
#                 await websocket.send_text(json.dumps({"error": "Акция не найдена"}))
#                 await asyncio.sleep(5)
#                 continue

#             # Берем последнее значение и предпоследнее для вычисления изменения
#             last = history.iloc[-1]
#             previous = history.iloc[-2] if len(history) >= 2 else last
#             change = last['Close'] - previous['Close']

#             data = {
#                 "symbol": symbol.upper(),
#                 "price": round(last["Close"], 2),
#                 "change": round(change, 2)
#             }
#             await websocket.send_text(json.dumps(data))
#             # Обновляем данные каждые 5 секунд (настрой по необходимости)
#             await asyncio.sleep(5)
#     except WebSocketDisconnect:
#         print(f"WebSocket connection for {symbol} closed")
