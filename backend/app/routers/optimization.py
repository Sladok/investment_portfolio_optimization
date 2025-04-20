from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import logging
import os
from dotenv import load_dotenv
from tvDatafeed import Interval
from backend.app.utils.optimize_portfolio import get_stock_data, optimize_portfolio_utility, init_tvdatafeed
from backend.app.models.portfolio import PortfolioOptimizationRequest

load_dotenv()
tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 
init_tvdatafeed(tvdatafeed_login, tvdatafeed_pass)

router = APIRouter()


@router.post("/optimize/full")
async def optimize_full_portfolio(req: PortfolioOptimizationRequest):
    try:
        logger = logging.getLogger()
        logger.debug(f"Запуск полной оптимизации портфеля: {req.tickers}")

        to_date = pd.to_datetime(req.to_date or datetime.today().date())
        from_date = pd.to_datetime(req.from_date or (to_date - timedelta(days=365)))


        # Сбор цен
        prices = {}
        for ticker in req.tickers:
            series = get_stock_data(ticker, Interval.in_daily, bars=10000)
            prices[ticker] = series
        df = pd.DataFrame(prices)
        df = df.dropna()
        # df = df.loc[from_date:to_date].dropna()

        if df.empty:
            raise HTTPException(status_code=400, detail="Недостаточно данных для оптимизации")

        returns = df.pct_change().dropna()

        # Оптимизация
        opt_result = optimize_portfolio_utility(returns, risk_aversion=req.risk_aversion)

        # Начальные веса
        start_weights = np.array(req.start_weights if req.start_weights else [1/len(req.tickers)] * len(req.tickers))
        opt_weights = np.array(list(opt_result["weights"].values()))

        # Капитализация
        orig_cum = (returns @ start_weights).add(1).cumprod()
        opt_cum = (returns @ opt_weights).add(1).cumprod()
        logger.debug(f"весы портфеля: {opt_result['weights'].items()}")
        response = {
            "tickers": req.tickers,
            "start_weights": list(np.round(start_weights, 4)),
            "optimal_weights": {k: round(v, 4) for k, v in opt_result["weights"].items()},
            "expected_annual_return": round(opt_result["expected_return"], 4),
            "expected_annual_volatility": round(opt_result["expected_volatility"], 4),
            "quadratic_utility": round(opt_result["quadratic_utility"], 4),
            "performance": {
                "dates": orig_cum.index.strftime("%Y-%m-%d").tolist(),
                "original_cum": orig_cum.tolist(),
                "optimized_cum": opt_cum.tolist()
            },
            "correlation_matrix": opt_result['correlation_matrix'].to_dict() 
        }

        return response

    except Exception as e:
        logging.error(f"Ошибка в полной оптимизации: {e}")
        raise HTTPException(status_code=500, detail="Ошибка в процессе оптимизации портфеля")
    
# @router.post("/optimize/correlation")
# async def optimize_full_portfolio(req: PortfolioOptimizationRequest):