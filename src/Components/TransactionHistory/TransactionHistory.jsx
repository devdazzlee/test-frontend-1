import React from "react";

const TransactionHistory = ({ txHistory }) => {
  if (!txHistory || txHistory.length === 0) return null;

  return (
    <div className="mt-6 w-full p-4 shadow-lg rounded-2xl">
      <h2 className="text-3xl text-center mb-4 font-extrabold">
        Transaction History
      </h2>
      <div className="overflow-y-auto max-h-80 rounded">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Type</th>
              <th className="px-4 py-3 border-b border-gray-700">
                Sell Amount
              </th>
              <th className="px-4 py-3 border-b border-gray-700">Buy Amount</th>
            </tr>
          </thead>
          <tbody>
            {txHistory.map((tx, index) => (
              <tr
                key={index}
                className="text-center odd:bg-gray-700 even:bg-gray-800 text-white hover:bg-gray-600 transition"
              >
                <td
                  className={`px-4 py-3 font-bold ${
                    tx.type === "buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {tx.type.toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  {tx.sellAmount.amount} {tx.sellAmount.currency}
                </td>
                <td className="px-4 py-3">
                  {tx.buyAmount.amount.toFixed(2)} {tx.buyAmount.currency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
