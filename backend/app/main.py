from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from backend.app.routers import data
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 Можно указать конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)

# Данные о торговых активах (имитация без БД)
# aapl = data.get_stock_price("AAPL")["price"]
# tsla = data.get_stock_price("TSLA")["price"]
# BTC = data.get_stock_price("BTC")["price"]

aapl, tsla, BTC = 0, 0, 0

assets = {
    "AAPL": {"symbol": "AAPL", "name": "Apple Inc.", "price": aapl, "change": -1.25},
    "TSLA": {"symbol": "TSLA", "name": "Tesla Inc.", "price": tsla, "change": 3.67},
    "BTC": {"symbol": "BTC", "name": "Bitcoin", "price": BTC, "change": 250.75}
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
    uvicorn.run("main:app", reload=True)