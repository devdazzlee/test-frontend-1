"use client";

import {
  ChevronDown,
  CircleArrowDown,
  CircleArrowUp,
  Settings,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function BuySellPanel() {
  const initialTab = "buy";
  const tradeOptions = ["Buy Now", "Buy Dip", "Insta Buy"];
  const amountOptions = [0.25, 0.5, 1, 2, 5, 10];
  const initialSlippage = "20.0";
  const initialPriorityFee = "10.0";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tradeType, setTradeType] = useState(tradeOptions[0]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAutoApprove, setIsAutoApprove] = useState(true);
  const [priorityFee, setPriorityFee] = useState("Default");
  const [isChecked, setIsChecked] = useState(true);

  return (
    // max-w-sm
    <div className="w-1/3 mx-auto  stats-card rounded-2xl p-4 text-white mt-6">
      {/* Buy/Sell Toggle */}
      <div className="flex buy-sell-tab  rounded-full p-1 mb-4">
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
            {icon} {/* Render the icon */}
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "buy" ? (
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF85] font-medium">
            C
          </div>
          <input
            type="text"
            placeholder="Buy Sol from here...."
            className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF85] font-medium">
            C
          </div>
          <input
            type="text"
            placeholder="Buy Token from here..."
            className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
          />
        </div>
      )}

      <button className="mt-6 w-full py-3 rounded-xl text-black font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF85] to-yellow-400 hover:opacity-90 transition-opacity">
        <Zap className="w-5 h-5" />
        Quick Buy
      </button>
    </div>
  );
}
