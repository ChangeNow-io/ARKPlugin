const API_BASE_URL = 'https://changenow.io/api/v1';

class ApiWorker {
  constructor (client) {
    this.client = client;
  }

  async getAllCurrencies () {
    // walletApi.http.get('https://www.arkfun.io/games.json').then(res => {  
    // const res = await this.client.get(`${API_BASE_URL}/currencies?active=true`);
    const res = await this.client.get(`${API_BASE_URL}/currencies?active=true`);
    const data = JSON.parse(res.body);
    return data;
  }
}

module.exports = ApiWorker;