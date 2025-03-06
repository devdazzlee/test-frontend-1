"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { pumpFunAmmPriceGraph } from "@/utils/pump-fun-price-graph";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PulseChart = () => {
  const data2 = [
    { tokenAmount: 232323, solAmount: 0.32793295592626066, highlight: true },
  ];

  const data = pumpFunAmmPriceGraph;

  // Combine both data and data2 for labels and values
  const combinedData = [...data, ...data2];
  const combinedTokenAmounts = combinedData.map((item) => item.tokenAmount);
  const combinedSolAmounts = combinedData.map((item) => item.solAmount);
  const combinedHighlight = combinedData.map((item) => item.highlight);

  // Map data into chart format
  const chartData = {
    labels: combinedTokenAmounts, // Use combined tokenAmount as x-axis labels
    datasets: [
      {
        label: "Price (SOL) - Line Chart",
        data: data.map((item) => item.solAmount), // Use solAmount from the original data as y-axis data
        borderColor: "#4ADE80", // Green color for the line chart
        backgroundColor: "rgba(74, 222, 128, 0.2)", // Transparent green background for the line
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        type: "line", // This dataset will be a line chart
      },
      {
        label: "Current Price (SOL) - Scatter Chart",
        data: data2.map((item) => ({ x: item.tokenAmount, y: item.solAmount })), // Data for scatter chart
        borderColor: "#FF0000", // Red color for the scatter points
        backgroundColor: "#FF0000", // Red background for the scatter points
        pointRadius: combinedHighlight.map((highlight) => (highlight ? 10 : 5)), // Larger radius for highlighted points
        pointHoverRadius: combinedHighlight.map((highlight) => (highlight ? 15 : 10)), // Larger hover radius for highlighted points
        borderWidth: 2,
        type: "scatter", // This dataset will be a scatter chart
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0.00000279,
        max: 0.41, // Adjust based on your actual data range
      },
      x: {
        min: Math.min(...combinedTokenAmounts), // Dynamic x-axis range based on combined tokenAmount
        max: Math.max(...combinedTokenAmounts), // Dynamic x-axis range based on combined tokenAmount
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default PulseChart;
