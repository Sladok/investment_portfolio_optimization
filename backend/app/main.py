from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Данные о торговых активах (имитация без БД)
assets = {
    "AAPL": {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.23, "change": -1.25},
    "TSLA": {"symbol": "TSLA", "name": "Tesla Inc.", "price": 850.45, "change": 3.67},
    "BTC": {"symbol": "BTC", "name": "Bitcoin", "price": 37890.12, "change": 250.75}
}

# Модель для ответа с активами
class Asset(BaseModel):
    symbol: str
    name: str
    price: float
    change: float

@app.get("/assets", response_model=List[Asset])
def get_assets():
    """Возвращает список всех активов."""
    return list(assets.values())

@app.get("/assets/{symbol}", response_model=Asset)
def get_asset(symbol: str):
    """Возвращает данные по конкретному активу."""
    asset = assets.get(symbol.upper())
    if asset is None:
        raise HTTPException(status_code=404, detail="Актив не найден")
    return asset

@app.get("/news")
def get_market_news():
    """Возвращает последние рыночные новости."""
    return {
        "news": [
            {"title": "Фондовый рынок вырос на 2%", "source": "Bloomberg"},
            {"title": "Биткоин пробил уровень $38,000", "source": "CoinDesk"},
        ]
    }

# Запуск сервера (если файл запускается напрямую)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
