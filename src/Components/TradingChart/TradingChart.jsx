"use client";

import { useEffect, useRef } from "react";

const TradingChartApex = ({ chartData }) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartData && chartContainerRef.current) {
      // Dynamically import ApexCharts
      import("apexcharts").then((ApexChartsModule) => {
        const ApexCharts = ApexChartsModule.default;

        const options = {
          chart: {
            type: "candlestick",
            height: 400,
            background: "#0A0A0A",
            foreColor: "#0A0A0A",
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
              enabled: false, // Disable animations for better performance
            },
            zoom: {
              enabled: true,
              autoScaleYaxis: true,
            },
          },
          plotOptions: {
            candlestick: {
              colors: {
                upward: "#00B746",
                downward: "#EF403C",
              },
              wick: {
                useFillColor: true,
              },
              // Fixed width in pixels - direct solution
              barWidth: 4,
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
                  parseFloat(candle.close ?? 0),
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
              datetimeUTC: false,
            },
            axisBorder: {
              show: true,
              color: "#4A5568",
            },
            crosshairs: {
              show: true,
            },
            // Force the time scale to be uniform
            tickPlacement: "on",
            tickAmount: 10,
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
            floating: false,
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

        // Destroy previous instance if exists
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
      style={{
        borderRadius: "7px",
        overflow: "hidden",
        width: "100%",
        height: "400px",
      }}
      ref={chartContainerRef}
    ></div>
  );
};

export default TradingChartApex;
