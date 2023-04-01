class User {
    constructor(username, balance, stocks) {
        this.username = username;
        this.balance = balance;
        this.stocks = stocks;
    }
    getUserStats() {
        return `${this.username} ${this.balance}`;
    }
}

module.exports = User;