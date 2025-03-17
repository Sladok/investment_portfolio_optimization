from tvDatafeed import TvDatafeed, Interval
from dotenv import load_dotenv
import os

load_dotenv()
tvdatafeed_login, tvdatafeed_pass = os.getenv("tvdatafeed_login"), os.getenv("tvdatafeed_password") 

tv = TvDatafeed(tvdatafeed_login, tvdatafeed_pass)
data = tv.get_hist(symbol="AAPL", exchange="NASDAQ", interval=Interval.in_weekly, n_bars=100)

print(data)
