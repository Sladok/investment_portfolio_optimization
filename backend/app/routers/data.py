from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
from tvDatafeed import Interval, TvDatafeedLive
import pandas as pd
from async_lru import alru_cache  

load_dotenv()
router = APIRouter()
tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 

FROM_DATE = "2024-10-21"
TO_DATE = "2025-02-21"
INTERVALS = {"in_1_minute": Interval.in_1_minute,
            "in_3_minute": Interval.in_3_minute,
            "in_5_minute": Interval.in_5_minute,
            "in_15_minute": Interval.in_15_minute,
            "in_30_minute": Interval.in_30_minute,
            "in_45_minute":  Interval.in_45_minute,
            "in_1_hour":  Interval.in_1_hour,
            "in_2_hour":  Interval.in_2_hour,
            "in_3_hour":  Interval.in_3_hour,
            "in_4_hour": Interval.in_4_hour,
            "in_daily":  Interval.in_daily,
            "in_weekly":  Interval.in_weekly,
            "in_monthly":  Interval.in_monthly}

INTERV = "in_daily"

tv = TvDatafeedLive(tvdatafeed_login, tvdatafeed_pass)

@alru_cache(ttl=60)  # Кешируем на 60 секунд
async def fetch_stock_data(symbol: str, exchange: str = "NASDAQ"):
    """Асинхронное получение актуальной цены акции"""
    try:
        data = tv.get_hist(symbol=symbol, exchange=exchange, interval=Interval.in_1_minute, n_bars=1)
        if data is None or data.empty:
            raise HTTPException(status_code=404, detail="Акция не найдена")
        
        last_price = data["close"].iloc[-1]
        return {"symbol": symbol.upper(), "price": round(last_price, 2)}
    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения данных")

@router.get("/stock/{symbol}")
async def get_stock_price(symbol: str, exchange: str = "NASDAQ"):
    """Возвращает актуальную цену акции по тикеру"""
    return await fetch_stock_data(symbol, exchange)

@alru_cache(ttl=300)  # Кешируем исторические данные на 5 минут
async def fetch_stock_history(symbol: str, exchange: str = "NASDAQ", interval: str = "in_daily", from_date: str = "2024-02-21", to_date: str = "2025-02-20"):
    """Получение исторических данных акции"""
    try:
        data = tv.get_hist(symbol=symbol, exchange=exchange, interval=INTERVALS[interval], n_bars=100)
        if data is None or data.empty:
            raise HTTPException(status_code=404, detail="Нет данных по акции")

        data.index = pd.to_datetime(data.index)
        filtered_data = data[(data.index >= from_date) & (data.index <= to_date)]
        
        history = {str(date)[:10]: round(row["close"], 2) for date, row in filtered_data.iterrows()}
        
        return {"symbol": symbol.upper(), "history": history}
    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения данных")

@router.get("/stock/{symbol}/history")
async def get_stock_history(symbol: str, exchange: str = "NASDAQ", interval: str = "in_daily", from_date: str = "2025-02-01", to_date: str = "2025-02-20"):
    """Получает исторические данные акции"""
    return await fetch_stock_history(symbol, exchange, interval=interval, from_date=from_date, to_date=to_date)





# client = RESTClient(POLYGON_API_KEY)


# # @alru_cache(ttl=60)  # Кешируем на 60 секунд
# async def fetch_stock_data(symbol: str):
#     """Асинхронное получение данных об акции (использует EOD)"""
#     try:
#         response = client.get_daily_open_close_agg(symbol, "2025-02-20")
#     except Exception as ex:
#         print(ex)
#         raise HTTPException(status_code=404, detail="Акция не найдена")
    
#     if not response or not response.results:
#         raise HTTPException(status_code=404, detail="Нет данных по акции")
    
#     last_price = response.results[0]["c"]  # Цена закрытия
#     return {
#         "symbol": symbol.upper(),
#         "price": round(last_price, 2)
#     }


# @router.get("/stock/{symbol}")
# async def get_stock_price(symbol: str):
#     """Возвращает актуальную цену акции по тикеру"""
#     return await fetch_stock_data(symbol)

# # @alru_cache(ttl=300)  # Кешируем исторические данные на 5 минут
# async def fetch_stock_history(symbol: str, from_date: str = "2025-02-01", to_date: str = "2025-02-20"):
#     """Получение исторических данных акции (использует EOD)"""
#     try:
#         history = {}
#         current_date = from_date
        
#         while current_date <= to_date:
#             response = client.get_daily_open_close(symbol, current_date)
#             if response and response.close:
#                 history[current_date] = round(response.close, 2)
#             current_date = str(pd.to_datetime(current_date) + pd.Timedelta(days=1))[:10]
        
#     except Exception as ex:
#         print(ex)
#         raise HTTPException(status_code=404, detail="Нет данных по акции")
    
#     return {
#         "symbol": symbol.upper(),
#         "history": history
#     }


# @router.get("/stock/{symbol}/history")
# async def get_stock_history(symbol: str, timespan: str = "day", from_date: str = "2025-02-01", to_date: str = "2025-02-20"):
#     """Получает исторические данные акции"""
#     return await fetch_stock_history(symbol, timespan, from_date, to_date)























# # @alru_cache(ttl=60)  # Кешируем на 60 секунд
# async def fetch_stock_data(symbol: str):
#     """Асинхронное получение данных об акции"""
#     try:
#         response = client.get_last_trade(symbol)
#     except Exception as ex:
#         print(ex)
#         raise HTTPException(status_code=404, detail="Акция не найдена")
    
#     return {
#         "symbol": symbol.upper(),
#         "price": round(response.price, 2)
#     }

# @router.get("/stock/{symbol}")
# async def get_stock_price(symbol: str):
#     """Возвращает актуальную цену акции по тикеру"""
#     return await fetch_stock_data(symbol)

# # @alru_cache(ttl=300)  # Кешируем исторические данные на 5 минут
# async def fetch_stock_history(symbol: str, timespan: str = "day", from_date: str = "2025-02-01", to_date: str = "2025-02-20"):
#     """Асинхронное получение исторических данных акции"""
#     try:
#         response = client.get_aggs(symbol, 1, timespan, from_date, to_date)
#     except Exception:
#         raise HTTPException(status_code=404, detail="Нет данных по акции")
    
#     if not response or not response.results:
#         raise HTTPException(status_code=404, detail="Нет данных по акции")
    
#     history = {item["t"]: item["c"] for item in response.results}
    
#     return {
#         "symbol": symbol.upper(),
#         "history": history
#     }

# @router.get("/stock/{symbol}/history")
# async def get_stock_history(symbol: str, timespan: str = "day", from_date: str = "2025-02-01", to_date: str = "2025-02-20"):
#     """Получает исторические данные акции"""
#     return await fetch_stock_history(symbol, timespan, from_date, to_date)




# from fastapi import APIRouter, HTTPException
# import yfinance as yf
# from async_lru import alru_cache

# router = APIRouter()

# @alru_cache(ttl=60)  # Кешируем на 60 секунд
# async def fetch_stock_data(symbol: str):
#     """Асинхронное получение данных об акции"""
#     stock = yf.Ticker(symbol)
#     data = stock.history(period="1d")

#     if data.empty:
#         raise HTTPException(status_code=404, detail="Акция не найдена")
    
#     return {
#         "symbol": symbol.upper(),
#         "price": round(data["Close"].iloc[-1], 2)
#     }

# @router.get("/stock/{symbol}")
# async def get_stock_price(symbol: str):
#     """Возвращает актуальную цену акции по тикеру"""
#     return await fetch_stock_data(symbol)


# @alru_cache(ttl=300)  # Кешируем исторические данные на 5 минут
# async def fetch_stock_history(symbol: str, period: str):
#     """Асинхронное получение исторических данных акции"""
#     stock = yf.Ticker(symbol)
#     history = stock.history(period=period)

#     if history.empty:
#         raise HTTPException(status_code=404, detail="Нет данных по акции")

#     return {
#         "symbol": symbol,
#         "history": history["Close"].to_dict()
#     }

# @router.get("/stock/{symbol}/history")
# async def get_stock_history(symbol: str, period: str = "1mo"):
#     """Получает исторические данные акции"""
#     return await fetch_stock_history(symbol, period)



# from fastapi import APIRouter, HTTPException
# import yfinance as yf
# from datetime import datetime, timedelta

# router = APIRouter()

# @router.get("/stock/{symbol}")
# async def get_stock_price(symbol: str):
#     """Возвращает актуальную цену акции по тикеру"""
#     stock = yf.Ticker(symbol)
#     data = stock.history(period="1d")
    
#     if data.empty:
#         raise HTTPException(status_code=404, detail="Акция не найдена")
    
#     return {
#         "symbol": symbol.upper(),
#         "price": round(data["Close"].iloc[-1], 2)
#     }


# @router.get("/stock/{symbol}/history")
# async def get_stock_history(symbol: str, period: str = "1mo"):
#     """
#     Получает исторические данные акции.
#     :param symbol: Тикер акции (например, AAPL)
#     :param period: Период (1d, 5d, 1mo, 6mo, 1y, 5y, max)
#     """
#     try:
#         stock = yf.Ticker(symbol)
#         history = stock.history(period=period)

#         if history.empty:
#             raise HTTPException(status_code=404, detail="Нет данных по акции")

#         return {
#             "symbol": symbol,
#             "history": history["Close"].to_dict()
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
