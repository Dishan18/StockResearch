# Stock Research Dashboard

A quantitative stock analysis dashboard inspired by TradingView and Bloomberg terminals.

Built using:
- FastAPI
- Next.js
- TailwindCSS
- Lightweight Charts
- yfinance
- pandas
- ta

---

# Features

## Market Data
- Live stock market data using Yahoo Finance
- Indian stock support (`.NS`)

## Charting
- Candlestick charts
- Line charts
- Volume visualization
- Hover OHLC data

## Technical Indicators
- RSI
- MACD
- MACD Signal
- MACD Histogram

## Time Controls
- Preset timeframes
  - 1D
  - 1W
  - 1M
  - 3M
  - 6M
  - 1Y
  - 5Y

- Custom date range selection

## Analytics
- Period returns
- Price change visualization

---

# Tech Stack

## Frontend
- Next.js
- React
- TailwindCSS
- lightweight-charts
- Axios

## Backend
- FastAPI
- yfinance
- pandas
- ta

---

# Project Structure

```txt
StockResearch/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md