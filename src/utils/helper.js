const dummyTxHistory = [
  {
    type: "buy",
    sellAmount: { amount: 3.57, currency: "SOL" },
    buyAmount: { amount: 246.37, currency: "TOKEN" },
    date: "2025-03-07T09:13:28.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 2.73, currency: "SOL" },
    buyAmount: { amount: 198.51, currency: "TOKEN" },
    date: "2025-03-07T09:13:24.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 1.33, currency: "SOL" },
    buyAmount: { amount: 99.8, currency: "TOKEN" },
    date: "2025-03-07T09:13:22.241Z",
  },
  {
    type: "sell",
    sellAmount: { amount: 372.13, currency: "TOKEN" },
    buyAmount: { amount: 2.72, currency: "SOL" },
    date: "2025-03-07T09:13:19.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 1.81, currency: "SOL" },
    buyAmount: { amount: 173.82, currency: "TOKEN" },
    date: "2025-03-07T09:13:16.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 3.13, currency: "SOL" },
    buyAmount: { amount: 222.0, currency: "TOKEN" },
    date: "2025-03-07T09:12:59.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 0.19, currency: "SOL" },
    buyAmount: { amount: 14.22, currency: "TOKEN" },
    date: "2025-03-07T09:12:53.241Z",
  },
  {
    type: "sell",
    sellAmount: { amount: 275.36, currency: "TOKEN" },
    buyAmount: { amount: 2.8, currency: "SOL" },
    date: "2025-03-07T09:12:47.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 4.85, currency: "SOL" },
    buyAmount: { amount: 293.84, currency: "TOKEN" },
    date: "2025-03-07T09:12:45.241Z",
  },
  {
    type: "buy",
    sellAmount: { amount: 3.21, currency: "SOL" },
    buyAmount: { amount: 208.39, currency: "TOKEN" },
    date: "2025-03-07T09:12:24.241Z",
  },
];

// Convert string date to Date object for sorting and comparison
dummyTxHistory.forEach((tx) => {
  tx.date = new Date(tx.date);
});

// Function to calculate OHLC for a given 30-second interval
const getOHLC = (transactions) => {
  let open = null,
    high = -Infinity,
    low = Infinity,
    close = null;
  transactions.forEach((tx) => {
    const amount =
      tx.type === "buy" ? tx.buyAmount.amount : tx.sellAmount.amount;
    if (open === null) open = amount;
    high = Math.max(high, amount);
    low = Math.min(low, amount);
    close = amount;
  });
  return { open, high, low, close };
};

// Function to group transactions by 30s intervals
export const groupBy30s = (transactions, candleRange=30000) => {
  console.log("🚀 ~ groupBy30s ~ transactions:", transactions);
  transactions = transactions.map((tx) => {
    return { ...tx, date: new Date(tx.date) };
  });
  console.log("🚀 ~ groupBy30s ~ transactions:", transactions);
  const intervalGroups = [];
  let currentGroup = [];
  let currentInterval =
    Math.floor(transactions[0].date.getTime() / candleRange) * candleRange;

  transactions.forEach((tx) => {
    const intervalStart = Math.floor(tx.date.getTime() / candleRange) * candleRange;
    if (intervalStart !== currentInterval) {
      intervalGroups.push({
        interval: new Date(currentInterval),
        ohlc: getOHLC(currentGroup),
        range: `${new Date(currentInterval).toISOString()} - ${new Date(
          currentInterval + candleRange
        ).toISOString()}`,
      });
      currentGroup = [];
      currentInterval = intervalStart;
    }
    currentGroup.push(tx);
  });

  // Add last group
  intervalGroups.push({
    interval: new Date(currentInterval),
    ohlc: getOHLC(currentGroup),
    range: `${new Date(currentInterval).toISOString()} - ${new Date(
      currentInterval + candleRange
    ).toISOString()}`,
  });

  console.log("🚀 ~ groupBy30s ~ intervalGroups:", intervalGroups);
  return intervalGroups;
};
