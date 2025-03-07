"use client";

export class PumpFunAmm {
  // class PumpFunAmm {
    constructor() {
      this.totalSupply = 1000000000; // Total supply of tokens
      this.reservedTokens = 206900000; // Reserved tokens
      this.initialRealTokenBalance = 793100000; // Updated from image data
      this.realTokenBalance = 793100000; // Updated from image data
      this.realSolBalance = 0; // Updated from image data
  
      const virtualSol = 30; // SOL in the virtual liquidity pool
      const virtualToken = 1073000191; // Updated from image data
  
      this.solReserves = virtualSol; // Initial SOL in pool
      this.tokenReserves = virtualToken; // Initial Token Reserves
  
      // Set Constant Product K (k = x * y)
      this.K = this.solReserves * this.tokenReserves;
    }
    getProgess() {
      const _left = (this.realTokenBalance / this.initialRealTokenBalance) * 100;
      const progress = 100 - _left;
      console.log("🚀 Progress: xxxxxxxxxxxxxxxxxx", progress);
      return progress;
    }
    getState() {
      console.log("🚀 this.tokenSold:", this.initialRealTokenBalance - this.realTokenBalance);
      console.log("🚀 this.realTokenBalance:", this.realTokenBalance);
      console.log("🚀 this.realSolBalance:", this.realSolBalance);
  
      console.log("🚀 this.tokenReserves:", this.tokenReserves);
      console.log("🚀 this.solReserves:", this.solReserves);
      console.log(
        "🚀 this.initialRealTokenBalance:",
        this.initialRealTokenBalance
      );
  
      return {
        realTokenBalance: this.realTokenBalance,
        realSolBalance: this.realSolBalance,
        tokenReserves: this.tokenReserves,
        solReserves: this.solReserves,
        initialRealTokenBalance: this.initialRealTokenBalance,
      };
    }
  
    // Buy Tokens with SOL
    buyTokens(solAmount) {
      console.log(
        "============================== BUY TOKEN ============================="
      );
      // Tokens received = decrease in token reserves
      const { tokensBought, newSolReserves, newTokenReserves } =
        this.getTokenFrom(solAmount);
  
      // Update reserves
      this.solReserves = newSolReserves;
      this.tokenReserves = newTokenReserves;
      this.realTokenBalance -= tokensBought;
      this.realSolBalance += solAmount;
  
      console.log(
        "============================== BUY TOKEN END ============================="
      );
      return tokensBought;
    }
    buyViaTokenAmount(tokenAmount) {
      console.log(
        "============================== BUY TOKEN ============================="
      );
      // Tokens received = decrease in token reserves
      const { solPaid, newTokenReserves, newSolReserves } = this.getSolFor(tokenAmount);
  
      if (solPaid == 0) return 0;
  
      // Update reserves
      this.solReserves = newSolReserves;
      this.tokenReserves = newTokenReserves;
      this.realTokenBalance -= tokenAmount;
      this.realSolBalance += solPaid;
  
      console.log(
        "============================== BUY TOKEN END ============================="
      );
      return solPaid;
    }
  
    // Sell Tokens to get SOL
    sellTokens(tokenAmount) {
      console.log(
        "============================== SELL TOKEN ============================="
      );
      // SOL received = decrease in SOL reserves
      const { solReceived, newTokenReserves, newSolReserves } =
        this.getSolFrom(tokenAmount);
  
      // Update reserves
      this.solReserves = newSolReserves;
      this.tokenReserves = newTokenReserves;
      this.realTokenBalance += tokenAmount;
      this.realSolBalance -= solReceived;
  
      console.log(
        "============================== SELL TOKEN END ============================="
      );
  
      return solReceived;
    }
  
    // Get Current Token Price (SOL per Token)
    getPrice() {
      const price = this.solReserves / this.tokenReserves;
      console.log("Price:", price, " SOL / Token");
  
      return price;
    }
  
    // Get the estimated token amount for a given SOL input
    getTokenFrom(_sol) {
      if (_sol <= 0) {
        throw new Error("Invalid SOL amount");
      }
  
      const fee = 0;
      const effectiveSol = _sol + fee; // Apply fee
      const newSolReserves = this.solReserves + effectiveSol;
  
      // Calculate new token reserves using k = x * y
      const newTokenReserves = this.K / newSolReserves;
  
      // Tokens received = decrease in token reserves
      let tokensBought = this.tokenReserves - newTokenReserves;
  
      // Ensure we don't exceed available token supply
      if (tokensBought > this.realTokenBalance) {
        tokensBought = this.realTokenBalance;
      }
  
      // console.log(_sol, " SOL", "====>", tokensBought, " Token");
  
      return { tokensBought, newSolReserves, newTokenReserves };
    }
  
    // Get the estimated SOL amount for a given token input
    getSolFrom(_token) {
      if (_token <= 0) {
        console.log("Invalid token amount.");
        return {
          solReceived: 0,
          newTokenReserves: this.tokenReserves,
          newSolReserves: this.solReserves,
        };
      }
      if (_token > this.tokenReserves) {
        _token = this.tokenReserves;
      }
  
      const fee = 0; // Apply 0.3% fee
      const effectiveTokens = _token - fee; // Adjust for fee
  
      // Compute new token reserves after the swap
      const newTokenReserves = this.tokenReserves + effectiveTokens;
  
      // Compute new SOL reserves using K = x * y
      const newSolReserves = this.K / newTokenReserves;
  
      // SOL received = decrease in SOL reserves
      let solReceived = this.solReserves - newSolReserves;
  
      // Ensure we don't exceed available SOL supply
      solReceived = Math.min(solReceived, this.solReserves);
  
      // console.log(_token, "Token", "====>", solReceived, "SOL");
  
      return { solReceived, newTokenReserves, newSolReserves };
    }
    getSolFor(_token) {
      if (_token <= 0) {
        console.log("Invalid token amount.");
        return {
          solPaid: 0,
          newTokenReserves: this.tokenReserves,
          newSolReserves: this.solReserves,
        };
      }
      if (_token > this.tokenReserves) {
        _token = this.tokenReserves;
      }
  
      const fee = 0; // Apply 0.3% fee
      const effectiveTokens = _token - fee; // Adjust for fee
  
      // Compute new token reserves after the swap
      const newTokenReserves = this.tokenReserves - effectiveTokens;
  
      // Compute new SOL reserves using K = x * y
      const newSolReserves = this.K / newTokenReserves;
  
      // SOL received = decrease in SOL reserves
      let solPaid = newSolReserves - this.solReserves;
  
  
  
      // console.log(_token, "Token", "====>", solPaid, "SOL");
  
      return { solPaid, newTokenReserves, newSolReserves };
    }
}
