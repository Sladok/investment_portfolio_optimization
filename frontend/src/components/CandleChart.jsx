import React, { useEffect, useRef } from "react";
import * as LightweightCharts from "lightweight-charts";

const CandleChart = ({ data }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        if (!chartRef.current) {
            chartRef.current = LightweightCharts.createChart(chartContainerRef.current, {
                width: 800,
                height: 450,
                layout: { background: { color: "#1e1e1e" }, textColor: "#ffffff" },
                grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } }
            });

            seriesRef.current = chartRef.current.addCandlestickSeries();
        }

        if (seriesRef.current) {
            seriesRef.current.setData(data);
        }

        return () => chartRef.current?.remove();
    }, [data]);

    return <div ref={chartContainerRef} />;
};

export default CandleChart;


// import React, { useEffect, useRef } from "react";
// // import { createChart } from "lightweight-charts";
// import * as LightweightCharts from "lightweight-charts";


// const CandleChart = ({ data }) => {
//     const chartContainerRef = useRef(null);

//     useEffect(() => {
//         if (!chartContainerRef.current) return;

//         const chart = LightweightCharts.createChart(chartContainerRef.current, {
//             width: 700,
//             height: 400,
//             layout: { background: { color: "#1e1e1e" }, textColor: "#ffffff" },
//             grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } }
//         });

//         const candlestickSeries = chart.addCandlestickSeries();
//         candlestickSeries.setData(data);

//         return () => chart.remove();
//     }, [data]);

//     return <div ref={chartContainerRef} />;
// };

// export default CandleChart;
