import React from "react";

const TransactionHistory = ({ txHistory }) => {
  return (
    <div className="mt-6 w-full p-4 shadow-lg rounded-2xl">
      {/* <h2 className="text-3xl text-center mb-4 font-extrabold">
        Transaction History
      </h2> */}
      <div className="overflow-y-auto max-h-80 ">
        <table className="w-full  border-1 border-[#333]  rounded-2xl">
          <thead className="sticky top-0 bg-[#1C1C1C]">
            <tr>
              <th className="px-4 py-3 border-b border-[#333] text-sm text-gray-400">
                Type
              </th>
              <th className="px-4 py-3 border-b border-[#333] text-sm text-gray-400">
                Sell Amount
              </th>
              <th className="px-4 py-3 border-b border-[#333] text-sm text-gray-400">
                Buy Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {txHistory.length > 0 ? (
              txHistory.map((tx, index) => (
                <tr
                  key={index}
                  className="text-center bg-transparent text-white hover:bg-gray-600 transition"
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
              ))
            ) : (
              <tr className="text-center bg-transparent text-white hover:bg-gray-700 transition">
                <td
                  colSpan={3}
                  className={`px-4 py-3 font-bold text-sm text-gray-400 `}
                >
                  {" "}
                  No Transactions Found !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
