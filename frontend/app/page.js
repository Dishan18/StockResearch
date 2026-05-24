"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createChart } from "lightweight-charts";

export default function Home() {
  // CHART REFS
  const priceChartRef = useRef(null);

  const rsiChartRef = useRef(null);

  const macdChartRef = useRef(null);

  // INPUT STATES
  const [inputSymbol, setInputSymbol] = useState("RELIANCE");

  const [inputTimeframe, setInputTimeframe] = useState("1Y");

  const [inputStartDate, setInputStartDate] = useState("");

  const [inputEndDate, setInputEndDate] = useState("");

  // APPLIED STATES
  const [symbol, setSymbol] = useState("RELIANCE");

  const [timeframe, setTimeframe] = useState("1Y");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [isLineChart, setIsLineChart] = useState(false);

  const [returns, setReturns] = useState(null);

  const [hoverData, setHoverData] = useState(null);

  useEffect(() => {
    let priceChart;

    let rsiChart;

    let macdChart;

    async function fetchStockData() {
      try {
        let url = `http://127.0.0.1:8000/stock/${symbol}?timeframe=${timeframe}`;

        // CUSTOM DATE RANGE
        if (startDate && endDate) {
          url += `&start=${startDate}&end=${endDate}`;
        }

        const response = await axios.get(url);

        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          console.log("No data available for the given parameters.");
          return;
        }

        // CLEAR PREVIOUS CHARTS
        priceChartRef.current.innerHTML = "";

        rsiChartRef.current.innerHTML = "";

        macdChartRef.current.innerHTML = "";

        // RETURNS
        const firstClose = Number(data[0].Close);

        const lastClose = Number(data[data.length - 1].Close);

        const percentReturn = ((lastClose - firstClose) / firstClose) * 100;

        setReturns({
          percent: percentReturn.toFixed(2),

          change: (lastClose - firstClose).toFixed(2),

          first: firstClose.toFixed(2),

          last: lastClose.toFixed(2),
        });

        // =========================
        // PRICE CHART
        // =========================

        priceChart = createChart(priceChartRef.current, {
          width: priceChartRef.current.clientWidth,

          height: 620,

          layout: {
            background: {
              color: "#000000",
            },

            textColor: "#94a3b8",
          },

          grid: {
            vertLines: {
              color: "#172033",
            },

            horzLines: {
              color: "#172033",
            },
          },

          crosshair: {
            mode: 1,
          },

          rightPriceScale: {
            borderColor: "#172033",
          },

          timeScale: {
            borderColor: "#172033",
          },
        });

        // MAIN SERIES
        let mainSeries;

        if (isLineChart) {
          mainSeries = priceChart.addLineSeries({
            color: "#00d4d8",

            lineWidth: 2,
          });

          const lineData = data.map((item) => ({
            time: item.Date,

            value: Number(item.Close),
          }));

          mainSeries.setData(lineData);
        } else {
          mainSeries = priceChart.addCandlestickSeries({
            upColor: "#14b8a6",

            downColor: "#ef4444",

            borderUpColor: "#14b8a6",

            borderDownColor: "#ef4444",

            wickUpColor: "#14b8a6",

            wickDownColor: "#ef4444",
          });

          const candleData = data.map((item) => ({
            time: item.Date,

            open: Number(item.Open),

            high: Number(item.High),

            low: Number(item.Low),

            close: Number(item.Close),
          }));

          mainSeries.setData(candleData);
        }

        // =========================
        // VOLUME
        // =========================

        const volumeSeries = priceChart.addHistogramSeries({
          priceFormat: {
            type: "volume",
          },

          priceScaleId: "volume",
        });

        priceChart.priceScale("volume").applyOptions({
          scaleMargins: {
            top: 0.82,

            bottom: 0,
          },
        });

        const volumeData = data.map((item) => ({
          time: item.Date,

          value: Number(item.Volume),

          color:
            item.Close >= item.Open
              ? "rgba(20,184,166,0.35)"
              : "rgba(239,68,68,0.35)",
        }));

        volumeSeries.setData(volumeData);

        // =========================
        // HOVER DATA
        // =========================

        priceChart.subscribeCrosshairMove((param) => {
          if (!param.time) return;

          const pointData = data.find((d) => d.Date === param.time);

          if (!pointData) return;

          setHoverData({
            open: Number(pointData.Open).toFixed(2),

            high: Number(pointData.High).toFixed(2),

            low: Number(pointData.Low).toFixed(2),

            close: Number(pointData.Close).toFixed(2),

            volume: Number(pointData.Volume),
          });
        });

        // =========================
        // RSI CHART
        // =========================

        rsiChart = createChart(rsiChartRef.current, {
          width: rsiChartRef.current.clientWidth,

          height: 180,

          layout: {
            background: {
              color: "#000000",
            },

            textColor: "#94a3b8",
          },

          grid: {
            vertLines: {
              color: "#172033",
            },

            horzLines: {
              color: "#172033",
            },
          },

          rightPriceScale: {
            borderColor: "#172033",
          },

          timeScale: {
            borderColor: "#172033",
          },
        });

        const rsiSeries = rsiChart.addLineSeries({
          color: "#a855f7",

          lineWidth: 2,
        });

        const rsiData = data
          .filter((item) => Number(item.RSI) !== 0)
          .map((item) => ({
            time: item.Date,
            value: Number(item.RSI),
          }));

        rsiSeries.setData(rsiData);

        // RSI 70 LINE
        const overbought = rsiChart.addLineSeries({
          color: "rgba(239,68,68,0.5)",

          lineWidth: 1,
        });

        overbought.setData(
          data.map((item) => ({
            time: item.Date,

            value: 70,
          })),
        );

        // RSI 30 LINE
        const oversold = rsiChart.addLineSeries({
          color: "rgba(34,197,94,0.5)",

          lineWidth: 1,
        });

        oversold.setData(
          data.map((item) => ({
            time: item.Date,

            value: 30,
          })),
        );

        // =========================
        // MACD CHART
        // =========================

        macdChart = createChart(macdChartRef.current, {
          width: macdChartRef.current.clientWidth,

          height: 240,

          layout: {
            background: {
              color: "#000000",
            },

            textColor: "#94a3b8",
          },

          grid: {
            vertLines: {
              color: "#172033",
            },

            horzLines: {
              color: "#172033",
            },
          },

          rightPriceScale: {
            borderColor: "#172033",
          },

          timeScale: {
            borderColor: "#172033",
          },
        });

        // MACD LINE
        const macdSeries = macdChart.addLineSeries({
          color: "#06b6d4",

          lineWidth: 2,
        });

        macdSeries.setData(
          data.map((item) => ({
            time: item.Date,

            value: Number(item.MACD),
          })),
        );

        // SIGNAL LINE
        const signalSeries = macdChart.addLineSeries({
          color: "#f59e0b",

          lineWidth: 2,
        });

        signalSeries.setData(
          data.filter((item) => Number(item.MACD) !== 0).map((item) => ({
            time: item.Date,
            value: Number(item.MACD_SIGNAL),
          })),
        );

        // HISTOGRAM
        const histSeries = macdChart.addHistogramSeries({
          priceFormat: {
            type: "price",
          },
        });

        histSeries.setData(
          data.map((item) => ({
            time: item.Date,

            value: Number(item.MACD_DIFF),

            color:
              Number(item.MACD_DIFF) >= 0
                ? "rgba(34,197,94,0.5)"
                : "rgba(239,68,68,0.5)",
          })),
        );

        // FIT CONTENT
        priceChart.timeScale().fitContent();

        rsiChart.timeScale().fitContent();

        macdChart.timeScale().fitContent();
      } catch (error) {
        console.log(error);
      }
    }

    fetchStockData();

    return () => {
      if (priceChart) priceChart.remove();

      if (rsiChart) rsiChart.remove();

      if (macdChart) macdChart.remove();
    };
  }, [symbol, timeframe, startDate, endDate, isLineChart]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-5">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-5">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Stock Research
            </h1>

            <p className="text-gray-500 mt-1 text-sm">
              Quantitative Market Dashboard
            </p>
          </div>

          {returns && (
            <div className="bg-[#0b0f17] border border-[#1e293b] rounded-2xl px-5 py-4 min-w-[260px]">
              <div className="text-gray-500 text-xs mb-1">PERIOD RETURN</div>

              <div
                className={`text-3xl font-bold ${
                  Number(returns.percent) >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {returns.percent}%
              </div>

              <div className="text-sm text-gray-400 mt-1">
                {returns.first} → {returns.last}
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          {/* SYMBOL */}
          <input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol"
            className="
              bg-[#0b1220]
              border border-[#1e293b]
              px-4 py-3
              rounded-xl
              text-lg
              outline-none
              w-[220px]
            "
          />

          {/* TIMEFRAME */}
          <select
            value={inputTimeframe}
            onChange={(e) => setInputTimeframe(e.target.value)}
            className="
              bg-[#0b1220]
              border border-[#1e293b]
              px-4 py-3
              rounded-xl
              text-lg
              outline-none
            "
          >
            <option>1D</option>
            <option>1W</option>
            <option>1M</option>
            <option>3M</option>
            <option>6M</option>
            <option>1Y</option>
            <option>5Y</option>
          </select>

          {/* START DATE */}
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={inputStartDate}
            onChange={(e) => setInputStartDate(e.target.value)}
            className="
              bg-[#0b1220]
              border border-[#1e293b]
              px-4 py-3
              rounded-xl
              text-sm
              outline-none
            "
          />

          {/* END DATE */}
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={inputEndDate}
            onChange={(e) => setInputEndDate(e.target.value)}
            className="
              bg-[#0b1220]
              border border-[#1e293b]
              px-4 py-3
              rounded-xl
              text-sm
              outline-none
            "
          />

          {/* SHOW BUTTON */}
          <button
            onClick={() => {
              setSymbol(inputSymbol);

              setTimeframe(inputTimeframe);

              setStartDate(inputStartDate);

              setEndDate(inputEndDate);
            }}
            className="
              bg-cyan-500
              hover:bg-cyan-400
              text-black
              font-semibold
              px-5 py-3
              rounded-xl
              transition
            "
          >
            Show
          </button>

          {/* RESET */}
          <button
            onClick={() => {
              setInputStartDate("");

              setInputEndDate("");

              setStartDate("");

              setEndDate("");
            }}
            className="
              bg-[#111827]
              border border-[#1e293b]
              px-4 py-3
              rounded-xl
              text-sm
              hover:bg-[#172033]
              transition
            "
          >
            Reset Dates
          </button>

          {/* LINE CHART */}
          <label className="flex items-center gap-3 text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={isLineChart}
              onChange={() => setIsLineChart(!isLineChart)}
              className="w-4 h-4"
            />
            Line Chart
          </label>
        </div>

        {/* HOVER INFO */}
        {hoverData && (
          <div className="mb-3 flex gap-6 text-sm text-gray-300 flex-wrap">
            <span>
              O <span className="text-white">{hoverData.open}</span>
            </span>

            <span>
              H <span className="text-emerald-400">{hoverData.high}</span>
            </span>

            <span>
              L <span className="text-red-400">{hoverData.low}</span>
            </span>

            <span>
              C <span className="text-cyan-400">{hoverData.close}</span>
            </span>

            <span>
              Vol{" "}
              <span className="text-yellow-400">
                {Intl.NumberFormat().format(hoverData.volume)}
              </span>
            </span>
          </div>
        )}

        {/* PRICE CHART */}
        <div
          ref={priceChartRef}
          className="
            border border-[#172033]
            rounded-2xl
            overflow-hidden
            mb-4
          "
        />

        {/* RSI */}
        <div
          ref={rsiChartRef}
          className="
            border border-[#172033]
            rounded-2xl
            overflow-hidden
            mb-4
          "
        />

        {/* MACD */}
        <div
          ref={macdChartRef}
          className="
            border border-[#172033]
            rounded-2xl
            overflow-hidden
          "
        />
      </div>
    </div>
  );
}
