"use client";

import { ChevronDown, Settings, Zap } from "lucide-react";
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
    <div className="w-2/ mx-auto  stats-card rounded-2xl p-4 text-white mt-6">
      {/* Buy/Sell Toggle */}
      <div className="flex buy-sell-tab  rounded-full p-1 mb-4">
        {[
          { label: "buy", icon: <></> },
          { label: "sell", icon: <></> },
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

      {/* Amount Input */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00FF85] font-medium">
          C
        </div>
        <input
          type="text"
          placeholder="Amount to buy in CRE"
          className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-8 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
        />
      </div>

      {/* Advanced Settings */}
      <div className="space-y-3 mb-4">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="w-full flex items-center justify-between advance-input rounded-xl py-1 px-3 text-sm"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <Settings className="w-4 h-4" />
            Advanced Settings
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isAdvancedOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isAdvancedOpen && (
          <div className="space-y-3 pt-1 links-main-div p-1">
            <div className="flex w-full items-center mt-1">
              {/* Slippage Input Section */}
              <div className="w-2/4">
                <div className="text-xs text-gray-400 mb-2">Slippage %</div>
                <input
                  type="text"
                  defaultValue="20.0"
                  className="w-full advance-input  px-3 py-1 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Auto Approve Section */}
              <div className="flex flex-col items-center justify-center w-2/4">
                <div className="text-xs text-gray-400 mb-2">Auto Approve</div>
                <label className="flex items-center space-x-2 ">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  <div
                    className={`w-4 h-4 flex items-center justify-center rounded-md ${
                      isChecked
                        ? "bg-gradient-to-r from-green-400 to-yellow-400"
                        : "bg-gray-600"
                    }`}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="white"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">Enable</span>
                </label>
              </div>
            </div>

            {/* Auto Approve */}

            <div>
              <div className="text-xs text-gray-400 mb-2">Priority Fee</div>
              <div className="flex gap-2 my-2 ">
                {["Default", "2x", "3x"].map((fee) => (
                  <button
                    key={fee}
                    onClick={() => setPriorityFee(fee)}
                    className={`flex-1 bg-[#1C1C1C]  advance-input rounded-xl py-[4px] text-sm ${
                      priorityFee === fee ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {fee}
                  </button>
                ))}
              </div>
              <div className="flex items-center  my-3 text-start">
                <input
                  type="text"
                  defaultValue={initialPriorityFee}
                  className="w-2/3 advance-input rounded-2xl  px-3 text-sm focus:outline-none"
                />
                <div className=" text-gray-400 text-sm ml-2">gwei</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="mt-6 w-full py-3 rounded-xl text-black font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-[#00FF85] to-yellow-400 hover:opacity-90 transition-opacity">
        <Zap className="w-5 h-5" />
        Quick Buy
      </button>
    </div>
  );
}
