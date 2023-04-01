class Stock {
    constructor(symbol, amount) {
        this.symbol = symbol;
        this.amount = amount;
    }
    getStockStats() {
        return `${this.symbol} ${this.amount}`;
    }
}

module.exports = User;