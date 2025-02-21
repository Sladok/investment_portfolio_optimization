from tvDatafeed import TvDatafeedLive, Interval

# Можно использовать без логина (ограниченный доступ)
login = "sladok.130@bk.ru"
password = "Vata13246587"
tv = TvDatafeedLive(login, password)

def get_tradingview_price(symbol: str, exchange: str = "NASDAQ"):
    try:
        data = tv.get_hist(symbol=symbol, exchange=exchange, interval=Interval.in_1_minute, n_bars=1)
        last_price = data["close"].iloc[-1]
        return {"symbol": symbol.upper(), "price": last_price}
    except Exception as e:
        print(f"Ошибка: {e}")
        return None

print(get_tradingview_price("AAPL"))



# import requests
# from bs4 import BeautifulSoup

# def get_alphaquery_price(symbol: str):
#     url = f"https://www.alphaquery.com/stock/{symbol}/profile-key-metrics"
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 YaBrowser/25.2.0.0 Safari/537.36"
#     }
    
#     response = requests.get(url, headers=headers)
#     print(response.text[:1000])  # Выводим первые 1000 символов ответа

#     soup = BeautifulSoup(response.text, "html.parser")
#     price_tag = soup.find("td", {"class": "last"})

#     if not price_tag:
#         raise ValueError("Цена не найдена. Возможно, сайт изменил структуру или заблокировал бота.")

#     price = float(price_tag.text.replace(",", "").strip())
    
#     return {"symbol": symbol.upper(), "price": price}

# print(get_alphaquery_price("AAPL"))

# import requests
# from bs4 import BeautifulSoup

# def get_alphaquery_price(symbol: str):
#     url = f"https://www.alphaquery.com/stock/{symbol}/profile-key-metrics"
#     headers = {"User-Agent": r"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 YaBrowser/25.2.0.0 Safari/537.36"}
    
#     response = requests.get(url, headers=headers)
    
#     soup = BeautifulSoup(response.text, "html.parser")
    
#     price = soup.find("td", {"class": "last"}).text.strip()
#     return {"symbol": symbol.upper(), "price": float(price.replace(",", ""))}

# print(get_alphaquery_price("AAPL"))

