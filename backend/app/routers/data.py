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
async def get_stock_history(symbol: str, exchange: str = "NASDAQ", interval: str = "in_daily", from_date: str = "2022-02-01", to_date: str = "2025-03-10"):
    """Получает исторические данные акции"""
    return await fetch_stock_history(symbol, exchange, interval=interval, from_date=from_date, to_date=to_date)


@router.get("/stock/{symbol}/candlestick")
async def get_stock_candlestick(symbol: str, exchange: str = "NASDAQ", interval: str = "in_daily", n_bars: int = 100):
    """Получает исторические свечи акции"""
    try:
        data = tv.get_hist(symbol=symbol, exchange=exchange, interval=INTERVALS[interval], n_bars=n_bars)
        if data is None or data.empty:
            raise HTTPException(status_code=404, detail="Нет данных по акции")

        candles = [
            {
                "datetime": str(index),
                "open": round(row["open"], 2),
                "high": round(row["high"], 2),
                "low": round(row["low"], 2),
                "close": round(row["close"], 2),
                "volume": int(row["volume"])
            }
            for index, row in data.iterrows()
        ]

        return {"symbol": symbol.upper(), "candles": candles}
    except Exception as e:
        print(f"Ошибка: {e}")
        raise HTTPException(status_code=500, detail="Ошибка получения данных")