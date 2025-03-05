export class PumpFunAmm {
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
    const progress =
      1-((this.realTokenBalance / this.initialRealTokenBalance) * 100);
    console.log("🚀 Progress:", progress);
    return progress;
  }
  getState() {

    console.log("🚀 this.realTokenBalance:", this.realTokenBalance);
    console.log("🚀 this.realSolBalance:", this.realSolBalance);

    console.log("🚀 this.tokenReserves:", this.tokenReserves);
    console.log("🚀 this.solReserves:", this.solReserves);

    
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

    console.log(_sol, " SOL", "====>", tokensBought, " Token");

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

    console.log(_token, "Token", "====>", solReceived, "SOL");

    return { solReceived, newTokenReserves, newSolReserves };
  }
}


// Example Usage
// const amm = new PumpFunAmm();

// amm.getState();

// const boughtTokenQoute1 = amm.getTokenFrom(0.0001); // 3576
// const boughtTokenQoute2 = amm.getTokenFrom(0.001); // 35765
// const boughtTokenQoute3 = amm.getTokenFrom(0.01); // 357547

// const boughtToken1 = amm.buyTokens(0.0001); // 3576

// const boughtTokenQoute4 = amm.getTokenFrom(0.005); // 178802
// const boughtTokenQoute5 = amm.getTokenFrom(0.05); // 1785346
// const boughtTokenQoute6 = amm.getTokenFrom(0.5); // 17590048

// const boughtToken2 = amm.buyTokens(0.005); // 178802

// const boughtTokenQoute7 = amm.getTokenFrom(0.005); // 178743
// const boughtTokenQoute8 = amm.getTokenFrom(0.05); // 1784751
// const boughtTokenQoute9 = amm.getTokenFrom(0.5); // 17584234

// const sellTokens1 = amm.sellTokens(178802); // 0.004999989580898756 sol

// const boughtTokenQoute10 = amm.getTokenFrom(0.005); // 178802
// const boughtTokenQoute11 = amm.getTokenFrom(0.05); // 1785346
// const boughtTokenQoute12 = amm.getTokenFrom(0.5); // 17590048

// const sellTokens2 = amm.sellTokens(3000); // 0.00008387729022629742 sol

// const boughtTokenQoute13 = amm.getTokenFrom(0.005); // 178803
// const boughtTokenQoute14 = amm.getTokenFrom(0.05); // 1785356
// const boughtTokenQoute15 = amm.getTokenFrom(0.5); // 17590148

// const boughtToken3 = amm.buyTokens(85); // 178802

// amm.getProgess();

// amm.getState();

// amm.getTokenFrom(11111111111)
// amm.getSolFrom(793096422.9719648)
