import json
from typing import Dict
import pandas as pd
from fastapi import HTTPException

def get_all_tickers():
    with open("data/raw/company_tickers_exchange.json", "r") as f:
        ticker_data = json.load(f)

    ticker_df = pd.DataFrame(ticker_data["data"], columns=ticker_data["fields"])
    ticker_dict = {row["ticker"].upper(): row["exchange"] for _, row in ticker_df.iterrows()}
    return ticker_dict


def get_exchange_for_symbol(ticker_dict: Dict, symbol: str) -> str:
    exchange = ticker_dict.get(symbol.upper())
    if exchange is None:
        raise HTTPException(status_code=404, detail=f"Биржа для тикера '{symbol.upper()}' не найдена")
    return exchange.upper()

def get_all_tickers_with_names():
    with open("data/raw/company_tickers_exchange.json", "r") as f:
        ticker_data = json.load(f)

    df = pd.DataFrame(ticker_data["data"], columns=ticker_data["fields"])
    # Оставим только нужные колонки
    return [
        {"ticker": row["ticker"].upper(), "name": row["name"]}
        for _, row in df.iterrows()
    ]

def search_tickers(query: str, limit: int = 50):
    with open("data/raw/company_tickers_exchange.json", "r") as f:
        ticker_data = json.load(f)

    df = pd.DataFrame(ticker_data["data"], columns=ticker_data["fields"])
    query = query.lower()
    
    filtered = df[
        df["ticker"].str.lower().str.contains(query) | 
        df["name"].str.lower().str.contains(query)
    ].head(limit)

    return [
        {"ticker": row["ticker"].upper(), "name": row["name"]}
        for _, row in filtered.iterrows()
    ]
