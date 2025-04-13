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

load_dotenv()
tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 
init_tvdatafeed(tvdatafeed_login, tvdatafeed_pass)

router = APIRouter()

class PortfolioOptimizationRequest(BaseModel):
    tickers: List[str]
    exchange: str = "NASDAQ"
    from_date: Optional[str] = None
    to_date: Optional[str] = None
    risk_aversion: float = 3.0
    start_weights: Optional[List[float]] = None

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
            series = get_stock_data(ticker, req.exchange, Interval.in_daily, bars=10000)
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
            }
        }

        return response

    except Exception as e:
        logging.error(f"Ошибка в полной оптимизации: {e}")
        raise HTTPException(status_code=500, detail="Ошибка в процессе оптимизации портфеля")


# import logging
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# import numpy as np
# import pandas as pd
# from scipy.optimize import minimize
# from datetime import datetime, timedelta
# from typing import List
# from async_lru import alru_cache
# import os
# from dotenv import load_dotenv
# from tvDatafeed import Interval, TvDatafeedLive

# # Настройка логирования
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger()

# load_dotenv()
# router = APIRouter()
# tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 
# tv = TvDatafeedLive(tvdatafeed_login, tvdatafeed_pass)

# # Модели запросов
# class OptimizationRequest(BaseModel):
#     tickers: List[str]
#     exchange: str = "NASDAQ"
#     risk_free_rate: float = 0.03  # Безрисковая ставка по умолчанию 3%
#     from_date: str = None  # Дата начала (по умолчанию год назад)
#     to_date: str = None  # Дата конца (по умолчанию сегодня)

# INTERVALS = {"in_1_minute": Interval.in_1_minute,
#             "in_3_minute": Interval.in_3_minute,
#             "in_5_minute": Interval.in_5_minute,
#             "in_15_minute": Interval.in_15_minute,
#             "in_30_minute": Interval.in_30_minute,
#             "in_45_minute":  Interval.in_45_minute,
#             "in_1_hour":  Interval.in_1_hour,
#             "in_2_hour":  Interval.in_2_hour,
#             "in_3_hour":  Interval.in_3_hour,
#             "in_4_hour": Interval.in_4_hour,
#             "in_daily":  Interval.in_daily,
#             "in_weekly":  Interval.in_weekly,
#             "in_monthly":  Interval.in_monthly}

# INTERV = "in_daily"

# # Путь к API
# router = APIRouter()

# @alru_cache(ttl=300)  # Кешируем на 5 минут
# async def fetch_stock_history(symbol: str, exchange: str = "NASDAQ", interval: str = "in_daily", from_date: str = "2024-02-21", to_date: str = "2025-02-20"):
#     """Получение исторических данных акции"""
#     try:
#         logger.debug(f"Запрос исторических данных для {symbol} с {from_date} по {to_date}")
#         data = tv.get_hist(symbol=symbol, exchange=exchange, interval=INTERVALS["in_daily"], n_bars=100)
#         if data is None or data.empty:
#             raise HTTPException(status_code=404, detail="Нет данных по акции")

#         data.index = pd.to_datetime(data.index)
#         filtered_data = data[(data.index >= from_date) & (data.index <= to_date)]
        
#         history = {str(date)[:10]: round(row["close"], 2) for date, row in filtered_data.iterrows()}
        
#         logger.debug(f"Исторические данные для {symbol}: {history}")
#         return {"symbol": symbol.upper(), "history": history}
#     except Exception as e:
#         logger.error(f"Ошибка при получении данных для {symbol}: {e}")
#         raise HTTPException(status_code=500, detail="Ошибка получения данных")

# def optimize_quadratic_utility(returns: pd.DataFrame, risk_aversion: float = 3.0, min_weight=0.0, max_weight=1.0):
#     """
#     Оптимизация портфеля с максимизацией квадратичной полезности.
    
#     :param returns: DataFrame доходностей
#     :param risk_aversion: Коэффициент неприятия риска (чем выше, тем осторожнее портфель)
#     :param min_weight: минимальный вес актива
#     :param max_weight: максимальный вес актива
#     :return: словарь с весами и метриками
#     """
#     try:
#         logger.debug(f"Запуск оптимизации с коэффициентом неприятия риска: {risk_aversion}")
#         mu = returns.mean() * 252  # годовая доходность
#         cov = returns.cov() * 252  # годовая ковариация
#         n = len(mu)

#         def utility(w):
#             return -(mu @ w - (risk_aversion / 2) * w.T @ cov @ w)

#         constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
#         bounds = [(min_weight, max_weight) for _ in range(n)]
#         x0 = np.ones(n) / n

#         logger.debug(f"Запуск оптимизации методом SLSQP")
#         res = minimize(utility, x0=x0, method='SLSQP', bounds=bounds, constraints=constraints)

#         if not res.success:
#             logger.error(f"Оптимизация не удалась: {res.message}")
#             raise RuntimeError("Оптимизация не удалась")

#         weights = res.x
#         expected_return = mu @ weights
#         expected_volatility = np.sqrt(weights.T @ cov @ weights)
#         utility_value = mu @ weights - (risk_aversion / 2) * weights.T @ cov @ weights

#         logger.debug(f"Оптимальные веса: {weights}")
#         logger.debug(f"Ожидаемая доходность: {expected_return}, Ожидаемая волатильность: {expected_volatility}")
        
#         return {
#             "optimal_weights": dict(zip(returns.columns, np.round(weights, 4))),
#             "expected_return": round(expected_return, 4),
#             "expected_volatility": round(expected_volatility, 4),
#             "quadratic_utility": round(utility_value, 4)
#         }
#     except Exception as e:
#         logger.error(f"Ошибка в оптимизации: {e}")
#         raise RuntimeError("Ошибка в оптимизации")

# @router.post("/optimize")
# async def optimize_portfolio(req: OptimizationRequest):
#     try:
#         logger.debug(f"Начинаем оптимизацию для портфеля: {req.tickers}")
        
#         # Дата по умолчанию — за 1 год
#         to_date = pd.to_datetime(req.to_date or datetime.today().date())
#         from_date = pd.to_datetime(req.from_date or (to_date - timedelta(days=365)))

#         # Получаем исторические данные для всех акций
#         price_data = {}
#         for ticker in req.tickers:
#             logger.debug(f"Получение исторических данных для {ticker}")
#             history = await fetch_stock_history(ticker, req.exchange, interval="in_daily",
#                                                 from_date=from_date.strftime("%Y-%m-%d"),
#                                                 to_date=to_date.strftime("%Y-%m-%d"))
#             price_data[ticker] = pd.Series(history["history"]).astype(float)

#         df_prices = pd.DataFrame(price_data).dropna()
#         logger.debug(f"Исторические данные для всех акций:\n{df_prices.head()}")

#         # Вычисляем ежедневную доходность
#         returns = df_prices.pct_change().dropna()
#         logger.debug(f"Ежедневная доходность:\n{returns.head()}")

#         # Применяем оптимизацию квадратичной полезности
#         optimal_weights = optimize_quadratic_utility(returns, risk_aversion=3.0)

#         logger.debug(f"Оптимальные веса: {optimal_weights['optimal_weights']}")
#         return {
#             "optimal_weights": optimal_weights["optimal_weights"],
#             "expected_annual_return": optimal_weights["expected_return"],
#             "expected_annual_volatility": optimal_weights["expected_volatility"],
#             "quadratic_utility": optimal_weights["quadratic_utility"],
#         }
#     except Exception as e:
#         logger.error(f"Ошибка при оптимизации портфеля: {e}")
#         raise HTTPException(status_code=500, detail="Ошибка во время оптимизации портфеля")

