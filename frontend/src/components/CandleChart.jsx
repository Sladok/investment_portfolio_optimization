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
                grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } },
            });
    
            seriesRef.current = chartRef.current.addCandlestickSeries();
        }
    
        if (seriesRef.current) {
            seriesRef.current.setData(data);
        }
    
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, []); 
    
    useEffect(() => {
        if (seriesRef.current && data?.length) {
            seriesRef.current.setData(data);
        }
    }, [data]);
    

    return <div ref={chartContainerRef} />;
};

export default CandleChart;