# Stock Research Dashboard — Progress

## Project Goal

Build a quantitative stock research platform combining:

- Technical Analysis
- Financial Data Visualization
- NLP-based Sentiment Analysis
- Behavioral Finance Research

Core research hypothesis:

> Strongly negative financial sentiment may precede mean-reverting positive returns.

---

# Current Development Status

## Phase 1 — Core Market Dashboard
Status: COMPLETED

### Backend
- FastAPI backend created
- REST API endpoints implemented
- Yahoo Finance integration using yfinance
- Dynamic stock fetching
- Timeframe filtering support
- Custom date range support
- NSE stock handling (`.NS`)
- Error handling added
- CORS configured

### Technical Indicators
Implemented:
- RSI
- MACD
- MACD Signal
- MACD Histogram

### Frontend
Implemented using:
- Next.js
- TailwindCSS
- Lightweight Charts

Features:
- Candlestick chart
- Line chart toggle
- Volume histogram
- Hover OHLC display
- Return calculation panel
- Custom timeframe selection
- Custom date range input
- Show button workflow
- Reset filters
- Multi-panel technical chart layout

### Chart Panels
Implemented:
1. Price Chart
2. RSI Panel
3. MACD Panel

---

# Current Architecture

```txt
Frontend (Next.js)
    ↓
FastAPI Backend
    ↓
Yahoo Finance API
    ↓
Technical Indicator Engine