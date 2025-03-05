"use client";

import { PumpFunAmm } from "@/utils/pump-fun-final";
import {
  CircleArrowDown,
  CircleArrowUp,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import LabelValueRow from "./LabelValueRow/LabelValueRow";

export default function BuySellPanel() {
  const [amm, setAmm] = useState(null);
  const [activeTab, setActiveTab] = useState("buy");
  const [solInput, setSolInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAmm(new PumpFunAmm());
  }, []);

  const handleBuy = () => {
    if (!amm) return;
    const solAmount = parseFloat(solInput);
    if (isNaN(solAmount) || solAmount <= 0) {
      setMessage("Enter a valid SOL amount");
      return;
    }
    const tokensReceived = amm.buyTokens(solAmount);
    setMessage(`Bought ${tokensReceived.toFixed(2)} tokens`);
  };

  const handleSell = () => {
    if (!amm) return;
    const tokenAmount = parseFloat(tokenInput);
    if (isNaN(tokenAmount) || tokenAmount <= 0) {
      setMessage("Enter a valid token amount");
      return;
    }
    const solReceived = amm.sellTokens(tokenAmount);
    setMessage(`Received ${solReceived.toFixed(6)} SOL`);
  };

  return (
    <div className="w-1/3 mx-auto stats-card rounded-2xl p-4 text-white my-4 ">
      <h1 className="text-6xl font-extrabold text-center bg-gradient-to-r from-[#00FF85] to-yellow-400 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(0,255,133,0.6)] animate-text-glow">
        PUMP FUN
      </h1>

      <LabelValueRow label="Sol Balance" value="value here..." />
      <LabelValueRow label="Token balance" value="value here..." />
      <LabelValueRow label="Pump Fun Sol Balance" value="value here..." />
      <LabelValueRow label="Pump Fun Token Balance" value="value here..." />

      <div className="space-y-3 mt-4">
        <div className="flex buy-sell-tab rounded-full p-1 mb-4">
          {[
            { label: "buy", icon: <CircleArrowDown /> },
            { label: "sell", icon: <CircleArrowUp /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex-1 flex items-center justify-start gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors
        ${activeTab === label ? "bg-[#2C2C2C]" : "text-gray-400"}`}
            >
              {icon}
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "buy" ? (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF85] font-medium">
              C
            </div>
            <input
              type="number"
              value={solInput}
              onChange={(e) => setSolInput(e.target.value)}
              placeholder="Enter SOL Amount"
              className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
            />
            <button
              onClick={handleBuy}
              className="mt-6 w-full py-3 rounded-xl text-black font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF85] to-yellow-400 hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5" />
              Buy Tokens
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF85] font-medium">
              C
            </div>
            <input
              type="number"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter Token Amount"
              className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
            />
            <button
              onClick={handleSell}
              className="mt-6 w-full py-3 rounded-xl text-black font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF85] to-yellow-400 hover:opacity-90 transition-opacity"
            >
              <Zap className="w-5 h-5" />
              Sell Tokens
            </button>
          </div>
        )}
        {message && <div className="text-lg font-semibold mt-4">{message}</div>}
      </div>
    </div>
  );
}
