"use client";

import { useEffect, useRef } from "react";

const TradingChartApex = ({ chartData }) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartData && chartData.length > 0 && chartContainerRef.current) {
      // Dynamically import ApexCharts
      import("apexcharts").then((ApexChartsModule) => {
        const ApexCharts = ApexChartsModule.default;

        const options = {
          chart: {
            type: "candlestick",
            height: 400,
            background: "#1C1C1C", // Dark background for a sleek look
            foreColor: "#F7FAFC",
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
            animations: {
              enabled: true,
              easing: "easeinout",
              speed: 800,
            },
          },
          // Removed the title property for a cleaner look
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#00B746", // Green for bullish candles
                downward: "#EF403C", // Red for bearish candles
              },
              wick: {
                useFillColor: true,
              },
            },
          },
          series: [
            {
              data: chartData.map((candle) => ({
                x: new Date(candle.timestamp),
                y: [
                  parseFloat(candle.open ?? 0),
                  parseFloat(candle.high),
                  parseFloat(candle.low),
                  parseFloat(candle.close ?? 0)
                ],
              })),
            },
          ],
          xaxis: {
            type: "datetime",
            labels: {
              style: {
                colors: "#CBD5E0",
              },
            },
            axisBorder: {
              show: true,
              color: "#4A5568",
            },
            crosshairs: {
              show: true,
              stroke: {
                color: "#4A5568",
                width: 1,
                dashArray: 3,
              },
            },
          },
          yaxis: {
            tooltip: {
              enabled: true,
            },
            labels: {
              style: {
                colors: "#CBD5E0",
              },
            },
          },
          grid: {
            borderColor: "#2D3748",
            strokeDashArray: 3,
          },
          tooltip: {
            theme: "dark",
            x: {
              format: "dd MMM HH:mm",
            },
          },
          theme: {
            mode: "dark",
          },
          responsive: [
            {
              breakpoint: 768,
              options: {
                chart: {
                  height: 400,
                },
              },
            },
          ],
        };

        // Destroy previous instance if exists to avoid duplicate rendering
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new ApexCharts(
          chartContainerRef.current,
          options
        );
        chartInstanceRef.current.render();
      });
    }

    // Cleanup on component unmount or before re-rendering
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <div
      id="apex-chart"
      style={{ borderRadius: "7px", overflow: "hidden" }}
      ref={chartContainerRef}
    ></div>
  );
};

export default TradingChartApex;
