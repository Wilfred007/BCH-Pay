const axios = require('axios');

class PriceService {
    constructor() {
        this.baseUrl = 'https://api.coingecko.com/api/v3';
    }

    /**
     * Get current BCH price in a specific currency (e.g., USD, USDT)
     */
    async getBCHPrice(currency = 'usd') {
        try {
            const response = await axios.get(`${this.baseUrl}/simple/price`, {
                params: {
                    ids: 'bitcoin-cash',
                    vs_currencies: currency
                }
            });

            return response.data['bitcoin-cash'][currency.toLowerCase()];
        } catch (error) {
            console.error('Error fetching BCH price:', error);
            throw error;
        }
    }

    /**
     * Calculate BCH amount for a given fiat amount
     */
    async calculateBCHAmount(fiatAmount, currency = 'usd') {
        const price = await this.getBCHPrice(currency);
        const bchAmount = fiatAmount / price;
        return {
            bchAmount: parseFloat(bchAmount.toFixed(8)),
            rate: price
        };
    }
}

module.exports = new PriceService();
