from fastapi import APIRouter, HTTPException
import yfinance as yf
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stock/{symbol}")
def get_stock_price(symbol: str):
    """Возвращает актуальную цену акции по тикеру"""
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")
    
    if data.empty:
        raise HTTPException(status_code=404, detail="Акция не найдена")
    
    return {
        "symbol": symbol.upper(),
        "price": round(data["Close"].iloc[-1], 2)
    }


@router.get("/stock/{symbol}/history")
def get_stock_history(symbol: str, period: str = "1mo"):
    """
    Получает исторические данные акции.
    :param symbol: Тикер акции (например, AAPL)
    :param period: Период (1d, 5d, 1mo, 6mo, 1y, 5y, max)
    """
    try:
        stock = yf.Ticker(symbol)
        history = stock.history(period=period)

        if history.empty:
            raise HTTPException(status_code=404, detail="Нет данных по акции")

        return {
            "symbol": symbol,
            "history": history["Close"].to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
