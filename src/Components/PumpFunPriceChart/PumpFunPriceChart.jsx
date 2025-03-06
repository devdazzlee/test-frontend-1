"use client";
import React, { useState, useEffect } from "react";
import { pumpFunAmmPriceGraph } from "@/utils/pump-fun-price-graph";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from "recharts";

// Custom dot component
const CustomDot = (props) => {
  const { cx, cy, payload } = props;


  if (payload.highlight) {
    return (
      <svg
        x={cx - 20}
        y={cy - 43}
        width={40}
        height={40}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="green"
        className="size-7 z-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
        <circle cx={cx - 20} cy={cy - 42} r={10} fill={"green"} />
      </svg>
    );
  }

  return (
    <>
      <svg x={cx - 5} y={cy - 5} width={10} height={10} fill="#ccddee">
        <circle
          cx={5}
          cy={5}
          r={5}
          fill={payload.highlight ? "#ff7300" : "#82ca9d"}
        />
      </svg>
    </>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    if (payload[0].payload.highlight) {
      return (
        <div className="min-w-[220px] rounded-lg bg-gradient-to-br from-[#107919] to-[#0ea709] p-4 text-white shadow-lg">
          <p>Current Price SOL: {payload[0].payload.solAmount}</p>
          <p>Token Sold: {payload[0].payload.tokenAmount}</p>
        </div>
      );
    }
    return (
      <div className="min-w-[220px] rounded-lg bg-gradient-to-br from-[#49af6e] to-[#59e78d] p-4 text-white shadow-lg">
        <p>Price SOL: {payload[0].payload.solAmount}</p>
        <p>Token Sold: {payload[0].payload.tokenAmount}</p>
      </div>
    );
  }

  return null;
};

const PumpFunPriceChart = ({ tokenSold, currentPrice }) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    const sorted = pumpFunAmmPriceGraph(tokenSold, currentPrice).sort(
      (a, b) => a.tokenAmount - b.tokenAmount
    );
    setSortedData(sorted);
  }, [tokenSold, currentPrice]); // Only re-run when tokenSold or currentPrice change

  return (
    <>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={sortedData}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="tokenAmount" />
          <YAxis dataKey={"solAmount"} />
          <Tooltip
            content={
              <CustomTooltip
                active={undefined}
                payload={undefined}
                label={undefined}
              />
            }
          />
          <Legend />

          {/* Line Chart with Custom Dot */}
          <Line
            type="monotone"
            style={{ zIndex: 1 }}
            dataKey="solAmount"
            stroke="#82ca9d"
            name="Price SOL"
            dot={<CustomDot />} // Using custom dot component
            strokeWidth={1}
            activeDot={{ r: 5 }} // Optional: Make the active dot bigger when hovered
          />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

export default PumpFunPriceChart;
