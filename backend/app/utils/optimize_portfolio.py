
from tvDatafeed import Interval, TvDatafeed
import pandas as pd
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from backend.app.utils.tickers import get_exchange_for_symbol, get_all_tickers

tv = None
ticker_dict = get_all_tickers()


def init_tvdatafeed(login: str = None, password: str = None):
    global tv
    tv = TvDatafeed(username=login, password=password)


def get_stock_data(ticker, interval=Interval.in_daily, bars=10000):
    if tv is None:
        raise ValueError("tvDatafeed не инициализирован. Сначала вызови init_tvdatafeed().")
    exch = get_exchange_for_symbol(ticker_dict=ticker_dict, symbol=ticker)
    df = tv.get_hist(symbol=ticker, exchange=exch, interval=Interval.in_daily, n_bars=bars)
    if df is None or df.empty:
        raise ValueError(f"Нет данных для {ticker}")
    return df['close']


def optimize_portfolio_utility(returns: pd.DataFrame, risk_aversion: float = 3.0):
    mu = returns.mean() * 252
    cov = returns.cov() * 252
    correlation_matrix = returns.corr()  # Матрица корреляции между активами
    n = len(mu)

    def utility(w):
        return -(mu @ w - (risk_aversion / 2) * w.T @ cov @ w)

    bounds = [(0.0, 1.0) for _ in range(n)]
    constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
    x0 = np.ones(n) / n

    result = minimize(utility, x0, method='SLSQP', bounds=bounds, constraints=constraints)

    if not result.success:
        raise RuntimeError(result.message)
    return {
        'weights': dict(zip(returns.columns, result.x)),
        'expected_return': mu @ result.x,
        'expected_volatility': np.sqrt(result.x.T @ cov @ result.x),
        'quadratic_utility': mu @ result.x - (risk_aversion / 2) * result.x.T @ cov @ result.x,
        'correlation_matrix': correlation_matrix  # Возвращаем матрицу корреляции
    }