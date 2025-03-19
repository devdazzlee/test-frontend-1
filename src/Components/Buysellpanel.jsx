"use client";

import { PumpFunAmm } from "@/utils/pump-fun-final";
import { CircleArrowDown, CircleArrowUp, Wallet, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import LabelValueRow from "./LabelValueRow/LabelValueRow";
import Image from "next/image";
import TransactionHistory from "./TransactionHistory/TransactionHistory";
import SolanaLogo from "../../public/images/solana.png";
import PumpFunLogo from "../../public/images/Pump_fun_logo.png";
import HomeLoader from "./Skeleton/HomeLoader";
import { toast } from "react-toastify";
import PumpFunPriceChart from "./PumpFunPriceChart/PumpFunPriceChart";
import PulseChart from "./PumpFunPriceChart/PulseChart";
import TradeHistory from "./TradeHistory/TradeHistory";
import { dummyTx1, generateOHLCWithPrices, groupBy30s } from "@/utils/helper";
import { dummyTxHistory } from "@/utils/pump-fun-price-graph";
import TradingChartApex from "./TradingChart/TradingChart";
export default function BuySellPanel() {
  const [txHistory, setTxHistory] = useState([]);
  const [tradingChart, setTradingChart] = useState([]);
  const [amm, setAmm] = useState(null);
  const [userBalance, setUserBalance] = useState({
    solBalance: 100,
    tokenBalance: 0,
  });
  const [activeTab, setActiveTab] = useState("buy");
  const [solInput, setSolInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  const [buyQuote, setBuyQuote] = useState(0);
  const [sellQuote, setSellQuote] = useState(0);
  const [progress, setProgress] = useState(0);

  const [ammState, setAmmState] = useState({
    realTokenBalance: 0,
    realSolBalance: 0,
    tokenReserves: 0,
    solReserves: 0,
    initialRealTokenBalance: 0,
  });

  const resetAmm = () => {
    const newAmm = new PumpFunAmm();
    const _state = newAmm.getState();
    setAmm(newAmm);
    setAmmState(_state);
  };

  useEffect(() => {
    if (!amm) {
      resetAmm();
      setUserBalance({
        solBalance: 100,
        tokenBalance: 0,
      });
    }
  }, [amm]);

  const handleBuy = () => {
    if (!amm) return;
    const solAmount = parseFloat(solInput);
    if (isNaN(solAmount) || solAmount <= 0) {
      toast.error("Enter a valid SOL amount greater than zero");
      return;
    }
    if (solAmount > userBalance.solBalance) {
      toast.error("Not enough SOL available");
      return;
    }
    const oldPrice = parseFloat(amm.getSolFrom(1).solReceived);
    const tokensReceived = amm.buyTokens(solAmount);
    const newPrice = parseFloat(amm.getSolFrom(1).solReceived);

    const buyTx = {
      oldPrice,
      newPrice,
      type: "buy",
      sellAmount: {
        amount: solAmount,
        currency: "SOL",
      },
      buyAmount: {
        amount: tokensReceived,
        currency: "TOKEN",
      },
      timestamp: new Date().getTime(),
    };
    setTxHistory([...txHistory, buyTx]);

    setUserBalance((prev) => ({
      solBalance: prev.solBalance - solAmount,
      tokenBalance: prev.tokenBalance + tokensReceived,
    }));
    setSolInput("");
    refreshAmmState();
    toast.success(`Bought ${tokensReceived.toFixed(2)} tokens`);
    setBuyQuote(0);
  };

  const handleSell = () => {
    if (!amm) return;
    const tokenAmount = parseFloat(tokenInput);
    if (isNaN(tokenAmount) || tokenAmount <= 0) {
      toast.error("Enter a valid token amount greater than zero");
      return;
    }
    if (tokenAmount > userBalance.tokenBalance) {
      toast.error("Not enough token available");
      return;
    }
    const oldPrice = parseFloat(amm.getSolFrom(1).solReceived);
    const solReceived = amm.sellTokens(tokenAmount);

    const newPrice = parseFloat(amm.getSolFrom(1).solReceived);
    const sellTx = {
      oldPrice,
      newPrice,
      type: "sell",
      sellAmount: {
        amount: tokenAmount,
        currency: "TOKEN",
      },
      buyAmount: {
        amount: solReceived,
        currency: "SOL",
      },
      timestamp: new Date().getTime(),
    };
    setTxHistory([...txHistory, sellTx]);

    setUserBalance((prev) => ({
      solBalance: prev.solBalance + solReceived,
      tokenBalance: prev.tokenBalance - tokenAmount,
    }));
    setTokenInput("");
    refreshAmmState();
    toast.success(`Received ${solReceived.toFixed(6)} SOL`);
    setSellQuote(0);
  };

  const refreshAmmState = () => {
    if (!amm) return;
    const _state = amm.getState();
    const _progress = amm.getProgess();
    setAmmState(_state);
    setProgress(_progress);
  };

  const handleSolInputChange = (e) => {
    setSolInput(e.target.value);
    if (amm && e.target.value) {
      const solAmount = parseFloat(e.target.value);
      if (!isNaN(solAmount) && solAmount > 0) {
        setBuyQuote(amm.getTokenFrom(solAmount).tokensBought);
      } else {
        setBuyQuote(0);
      }
    } else {
      setBuyQuote(0);
    }
  };

  const handleTokenInputChange = (e) => {
    setTokenInput(e.target.value);
    if (amm && e.target.value) {
      const tokenAmount = parseFloat(e.target.value);
      if (!isNaN(tokenAmount) && tokenAmount > 0) {
        setSellQuote(amm.getSolFrom(tokenAmount).solReceived);
      } else {
        setSellQuote(0);
      }
    } else {
      setSellQuote(0);
    }
  };

  useEffect(() => {
    // const result = groupBy30s(dummyTxHistory, 30000);
    // setTradingChart(result);
    if (txHistory.length > 0) {
      // const result = groupBy30s(txHistory, 30000);
      const ohlc = generateOHLCWithPrices(txHistory);
      console.log("🚀 ~ useEffect ~ ohlc:", ohlc);

      setTradingChart(ohlc);
    }
    // console.log("tradingChart 🎇🎇🎇 ", result);
  }, [txHistory]);

  if (!amm) {
    return <HomeLoader />;
  }

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "https://test-cookies-server-production.up.railway.app/login", // Updated URL
        {
          email: "test@example.com",
          password: "password123",
        },
        {
          withCredentials: true,
          // headers: {
          //   // Request partitioned cookies
          //   "Accept-CH": "Sec-CH-Partitioned-Cookies",
          // },
        }
      );
      console.log("Login successful", response.data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h1 className=" mt-6 text-4xl font-extrabold text-center bg-gradient-to-r from-[#00FF85] to-yellow-400 text-transparent bg-clip-text drop-shadow-[0_0_10px_rgba(0,255,133,0.6)] animate-text-glow">
        PUMP FUN SIMULATOR
      </h1>

      <div className="flex flex-wrap justify-center">
        <button onClick={() => loginUser()}>Call Api</button>
        <div>
          <div className="w-full  mx-auto stats-card rounded-2xl p-4 text-white my-6">
            <div className="mt-2">
              <LabelValueRow
                label="Current Token Price"
                value={parseFloat(amm.getSolFrom(1).solReceived)}
                imageSrc={SolanaLogo}
              />
              <LabelValueRow
                label="Your Sol Balance"
                value={userBalance.solBalance.toFixed(2)}
                imageSrc={SolanaLogo}
              />
              <LabelValueRow
                label="Your Token balance"
                value={userBalance.tokenBalance.toFixed(2)}
                imageSrc={PumpFunLogo}
              />
              <LabelValueRow
                label="Pump Fun Sol Balance"
                value={ammState.realSolBalance.toFixed(2)}
                imageSrc={SolanaLogo}
              />
              <LabelValueRow
                label="Pump Fun Token Balance"
                value={ammState.realTokenBalance.toFixed(2)}
                imageSrc={PumpFunLogo}
              />
            </div>
            <div className="relative w-full h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex buy-sell-tab rounded-full p-1 mb-4">
                {[
                  { label: "buy", icon: <CircleArrowDown /> },
                  { label: "sell", icon: <CircleArrowUp /> },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => setActiveTab(label)}
                    className={`flex-1 flex items-center justify-start gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                      activeTab === label
                        ? label === "buy"
                          ? "bg-[#3eb66a] text-white"
                          : "bg-[#F87171] text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {icon}
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "buy" ? (
                <div className="relative">
                  <div className="relative w-full">
                    {/* Image inside the input field */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/images/solana.png"
                        alt="solana"
                        width={20}
                        height={20}
                      />
                    </div>

                    {/* Input field with left padding to avoid overlap */}
                    <input
                      type="number"
                      value={solInput}
                      onChange={handleSolInputChange}
                      placeholder="Enter SOL Amount"
                      className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-sm text-gray-400">
                    Estimated Tokens: {buyQuote.toFixed(2)}
                  </p>
                  <button
                    onClick={handleBuy}
                    className="mt-6 w-full py-3 rounded-xl  font-medium flex items-center justify-center gap-2 bg-[#3eb66a] text-white hover:opacity-90 transition-opacity"
                  >
                    <Zap className="w-5 h-5" />
                    Buy Tokens
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full">
                    {/* Wallet Icon on the Left */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Image
                        src="/images/Pump_fun_logo.png"
                        alt="solana"
                        width={20}
                        height={20}
                      />
                    </div>
                    {/* Input Field */}
                    <input
                      type="number"
                      value={tokenInput}
                      onChange={handleTokenInputChange}
                      placeholder="Enter Token Amount"
                      className="w-full bg-[#1C1C1C] rounded-xl py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-sm text-gray-400">
                    Estimated SOL: {sellQuote.toFixed(6)}
                  </p>
                  <button
                    onClick={handleSell}
                    className="mt-6 w-full py-3 rounded-xl  font-medium flex items-center justify-center gap-2 bg-[#F87171] text-white hover:opacity-90 transition-opacity"
                  >
                    <Zap className="w-5 h-5" />
                    Sell Tokens
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg mt-2">
          <TransactionHistory txHistory={txHistory} />
        </div>
      </div>
      <div className="container mx-auto flex w-full items-center">
        <div className="w-full">
          <TradingChartApex chartData={tradingChart} />
        </div>
        <div className="w-full">
          <PumpFunPriceChart
            tokenSold={
              ammState.initialRealTokenBalance - ammState.realTokenBalance
            }
            currentPrice={parseFloat(
              amm.getSolFrom(1000000).solReceived.toFixed(6)
            )}
          />
        </div>
        {/* <TradeHistory transactions={txHistory}/> */}
        {/* <div style={{ position: "relative", width: "100%", height: "500px" }}>
          <PulseChart data={priceData} />
        </div> */}
      </div>
    </div>
  );
}
