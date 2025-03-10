export const dummyTx1 = [
  {
    type: "sell",
    sellAmount: {
      amount: 11111111,
      currency: "TOKEN",
    },
    buyAmount: {
      amount: 2.9786291352333762,
      currency: "SOL",
    },
    date: "2025-03-10T08:03:27.454Z",
  },
  {
    type: "sell",
    sellAmount: {
      amount: 19111111,
      currency: "TOKEN",
    },
    buyAmount: {
      amount: 5.604247830143578,
      currency: "SOL",
    },
    date: "2025-03-10T08:02:28.609Z",
  },
  {
    type: "buy",
    sellAmount: {
      amount: 40,
      currency: "SOL",
    },
    buyAmount: {
      amount: 214600038.2,
      currency: "TOKEN",
    },
    date: "2025-03-10T08:02:02.590Z",
  },
  {
    type: "buy",
    sellAmount: {
      amount: 20,
      currency: "SOL",
    },
    buyAmount: {
      amount: 268250047.75,
      currency: "TOKEN",
    },
    date: "2025-03-10T08:01:54.363Z",
  },
  {
    type: "buy",
    sellAmount: {
      amount: 10,
      currency: "SOL",
    },
    buyAmount: {
      amount: 268250047.75,
      currency: "TOKEN",
    },
    date: "2025-03-10T08:01:35.096Z",
  },
];

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
export const groupBy30s = (transactions, candleRange = 30000) => {
  // console.log("🚀 ~ groupBy30s ~ transactions:", transactions);
  transactions = transactions.map((tx) => {
    return { ...tx, date: new Date(tx.date) };
  });
  // console.log("🚀 ~ groupBy30s ~ transactions:", transactions);
  const intervalGroups = [];
  let currentGroup = [];
  let currentInterval =
    Math.floor(transactions[0].date.getTime() / candleRange) * candleRange;

  transactions.forEach((tx) => {
    const intervalStart =
      Math.floor(tx.date.getTime() / candleRange) * candleRange;
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
  // console.log("🚀 ~ transactions.forEach ~ intervalGroups:", intervalGroups);

  // Add last group
  intervalGroups.push({
    interval: new Date(currentInterval),
    ohlc: getOHLC(currentGroup),
    range: `${new Date(currentInterval).toISOString()} - ${new Date(
      currentInterval + candleRange
    ).toISOString()}`,
  });

  // console.log("🚀 ~ groupBy30s ~ intervalGroups:", intervalGroups);
  return intervalGroups;
};

export const generateOHLCWithPrices = (transactions, interval = 40 * 1000) => {
  // console.log("🚀 ~ generateOHLCWithPrices ~ transactions:", transactions);
  // Initialize the result array
  let ohlcData = [];
  let currentCandle = null;
  let oldPrice = null; // Tracks the price before the current candle interval
  let afterPrice = null; // Tracks the price after the current candle interval

  // Sort transactions by timestamp
  transactions.sort((a, b) => a.timestamp - b.timestamp);

  transactions.forEach((transaction) => {
    const timeSlotStart =
      Math.floor(transaction.timestamp / interval) * interval;

    // Create a new candle for a new 30-second window
    if (!currentCandle || currentCandle.timestamp !== timeSlotStart) {
      if (currentCandle) {
        // Push the last candle with oldPrice and afterPrice
        currentCandle.oldPrice = oldPrice;
        currentCandle.afterPrice = transaction.newPrice;
        ohlcData.push(currentCandle);
      }

      // Reset for the new candle
      currentCandle = {
        timestamp: timeSlotStart,
        open: transaction.oldPrice,
        low: transaction.oldPrice,
        high: transaction.newPrice,
        close: transaction.newPrice,
      };

      // Update the oldPrice for the new candle
      oldPrice = currentCandle.open;
    }

    // Update High, Low, Close within the same time slot
    currentCandle.high = Math.max(currentCandle.high, transaction.newPrice);
    currentCandle.low = Math.min(currentCandle.low, transaction.newPrice);
    currentCandle.close = transaction.newPrice;
  });

  // Add the last candle if it exists
  if (currentCandle) {
    // We don't have an afterPrice for the last candle, so we can leave it as undefined or null
    currentCandle.oldPrice = oldPrice;
    currentCandle.afterPrice = afterPrice || currentCandle.close;
    ohlcData.push(currentCandle);
  }

  return ohlcData;
};
