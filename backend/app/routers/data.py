from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
from tvDatafeed import Interval, TvDatafeedLive, TvDatafeed
from async_lru import alru_cache  
from backend.app.utils.tickers import get_exchange_for_symbol, get_all_tickers

router = APIRouter()

load_dotenv()
tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 
tv = TvDatafeed(tvdatafeed_login, tvdatafeed_pass)

ticker_dict = get_all_tickers()


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
async def get_stock_price(symbol: str):
    """Возвращает актуальную цену акции по тикеру"""
    exchange = get_exchange_for_symbol(ticker_dict=ticker_dict, symbol=symbol)
    return await fetch_stock_data(symbol, exchange)


@router.get("/stock/{symbol}/candlestick")
async def get_stock_candlestick(symbol: str, n_bars: int = 100):
    """Получает исторические свечи акции"""
    try:
        exchange = get_exchange_for_symbol(ticker_dict=ticker_dict, symbol=symbol)
        data = tv.get_hist(symbol=symbol, exchange=exchange, interval=Interval.in_daily, n_bars=n_bars)
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