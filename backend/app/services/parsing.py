import yfinance as yf

def get_stock_price(symbol: str):
    """
    Получает актуальную цену акции по её тикеру.
    
    :param symbol: Тикер акции (например, "AAPL", "TSLA").
    :return: Словарь с тикером и ценой или None, если данные не найдены.
    """
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period="1d")
        
        if data.empty:
            return None
        
        return {
            "symbol": symbol.upper(),
            "price": round(data["Close"].iloc[-1], 2)  # Цена закрытия последнего дня
        }
    except Exception as e:
        print(f"Ошибка при получении данных: {e}")
        return None

# Пример вызова
print(get_stock_price("AAPL"))  # Получаем цену акций Apple
