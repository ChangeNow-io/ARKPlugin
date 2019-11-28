const API_BASE_URL = 'https://changenow.io/api/v1';
const API_KEY = '0a6d67c58b40a35f949329157a99e96753e64c06aa252d574fd32aa26631f5c2';

class ApiWorker {
  constructor (client) {
    this.client = client;
  }

  async getAllCurrencies () {
    const res = await this.client.get(`${API_BASE_URL}/currencies?active=true`);
    const data = JSON.parse(res.body);
    return data;
  }

  async exchangeAmount (fromTo, amount = 1) {
    // https://changenow.io/api/v1/exchange-amount/1.314452/btc_eth?api_key=changenow"
    const res = await this.client.get(`${API_BASE_URL}/exchange-amount/${amount}/${fromTo}?api_key=${API_KEY}`);
    const data = JSON.parse(res.body);
    return data;
  }

  async availableCurrencies (currency) {
    // https://changenow.io/api/v1/currencies-to/btc"
    const res = await this.client.get(`${API_BASE_URL}/currencies-to/${currency}`);
    const data = JSON.parse(res.body);
    return data;
  }

  async minilalExchangeAmount (fromTo) {
    // https://changenow.io/api/v1/min-amount/:from_to
    const res = await this.client.get(`${API_BASE_URL}/min-amount/${fromTo}`);
    const data = JSON.parse(res.body);
    return data;
  }

  async createExchange (params = {}) {
    // https://changenow.io/api/v1/transactions/:api_key
    const res = await this.client.post(`${API_BASE_URL}/min-amount/${API_KEY}`, params);
    const data = JSON.parse(res.body);
    return data;
  }
}

module.exports = ApiWorker;