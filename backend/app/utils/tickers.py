import json
from typing import Dict
import pandas as pd

def get_all_tickers():
    with open("data/raw/company_tickers_exchange.json", "r") as f:
        ticker_data = json.load(f)

    ticker_df = pd.DataFrame(ticker_data["data"], columns=ticker_data["fields"])
    ticker_dict = {row["ticker"].upper(): row["exchange"] for _, row in ticker_df.iterrows()}
    return ticker_dict


def get_exchange_for_symbol(ticker_dict: Dict, symbol: str) -> str:
    return ticker_dict[symbol.upper()].upper()