from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import pandas as pd

from ta.momentum import RSIIndicator
from ta.trend import MACD

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TIMEFRAME_MAP = {
    "1D": "1d",
    "1W": "5d",
    "1M": "1mo",
    "3M": "3mo",
    "6M": "6mo",
    "1Y": "1y",
    "5Y": "5y"
}


@app.get("/")
def home():
    return {"message": "Stock API Running"}


@app.get("/stock/{symbol}")
def get_stock(
    symbol: str,
    timeframe: str = "1Y",
    start: str = None,
    end: str = None
):

    try:

        ticker = f"{symbol}.NS"

        # CUSTOM DATE RANGE
        if start and end:

            df = yf.download(
                ticker,
                start=start,
                end=end,
                interval="1d",
                auto_adjust=True,
                progress=False
            )

        # PRESET TIMEFRAME
        else:

            period = TIMEFRAME_MAP.get(timeframe, "1y")

            df = yf.download(
                ticker,
                period=period,
                interval="1d",
                auto_adjust=True,
                progress=False
            )

        if df.empty:

            return {
                "error": "No stock data found"
            }

        df.reset_index(inplace=True)

        # FLATTEN MULTIINDEX
        df.columns = [
            col[0] if isinstance(col, tuple) else col
            for col in df.columns
        ]

        # RENAME DATE COLUMN
        df.rename(
            columns={df.columns[0]: "Date"},
            inplace=True
        )

        # RSI
        rsi = RSIIndicator(close=df["Close"])

        df["RSI"] = rsi.rsi()

        # MACD
        macd = MACD(close=df["Close"])

        df["MACD"] = macd.macd()

        df["MACD_SIGNAL"] = macd.macd_signal()

        df["MACD_DIFF"] = macd.macd_diff()

        # FILL NaN
        indicator_cols = [
            "RSI",
            "MACD",
            "MACD_SIGNAL",
            "MACD_DIFF"
        ]

        for col in indicator_cols:

            df[col] = df[col].fillna(0)

        # STRING DATE
        df["Date"] = df["Date"].astype(str)

        return df.to_dict(orient="records")

    except Exception as e:

        return {
            "error": str(e)
        }