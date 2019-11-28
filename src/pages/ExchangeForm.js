const ApiWorker = require('../apiWorker');

const defaultFrom = 'btc';
const defaultTo = 'eth';

const mainContainer = `
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b2b37 url(./logo.svg) 50% no-repeat;

`;

const mainHeader = `
  color: white;
  font-size: 48px;
`;

const subTitle = `
  margin-bottom: 50px;
  font-size: 28px;
  color: #5c5780;
`;

const mainBlock = `
  padding: 20xp;
`

const block = `
  display: flex;
  justify-content: center;
`;

const labelsBlock = `
  flex: 7;
`;

const formBlock = `
  flex: 5;
`;

const inputWrapper = `
  position: relative;
  background-color: #3D3D70;
  color: white;
  border-radius: 4px;
`;

const exchangeButton = `
  width: 100%;
  border-radius: 5px;
  height: 46px;
  line-height: 46px;
  padding: 0 46px;
  background: #3bee81;
  border: none;
  color: #fff;
  font-size: 20px;
  margin-top: 30px;
`;

const input = `
  color: #fff;
  background: none;
  border: 0;
  height: 70px;
  margin: 0;
  font-size: 24px;
  padding: 17px 150px 0 20px;
  width: 100%;
`;

const exchangeInputTitle = `
  color: #5e5a72;
  position: absolute;
  top: 5px;
  left: 20px;
  font-size: 14px;
`;

const exchangeInputSearch = `
  position: absolute;
  right: 0;
  top: 0;
  padding-left: 10px;
  border-left: 1px solid #5e5a72;
  width: 140px;
  height: 70px;
  font-size: 22px;
  color: white;
  display: flex;
  align-items: center;
`;


const arrow = `

  position: absolute;
  right: 14px;
  top: 32px;
  border: 6px solid transparent; 
  border-top: 6px solid white;
`;

const sequenceBlock = `
  height: 50px;
  width: 100%;
  padding-left: 50px;
  position: relative;
  display: flex;
  align-items: center;
`;

const circle = `
  position: absolute;
  width: 10px;
  height: 10px;
  top: 20px;
  left: 18px;
  background-color: #36324a;
  border-radius: 50%;
`;

const line = `
  position: absolute;
  left: 22px;
  height: 50px;
  top: 0;
  width: 2px;
  background-color: #36324a;
`;

const exchangeSequence = `
  font-size: 12px;
  color: white;
`;

const toggleButton = `
  position: absolute;
  width: 20px;
  height: 20px;
  background: #3bee81;
  right: 10px;
  top: 15px;
  cursor: pointer;
`;

const coinIcon = `
  width: 20px;
  margin-right: 5px;
  filter: invert(95%) sepia(57%) saturate(4466%) hue-rotate(69deg) brightness(86%) contrast(85%);
`;

const selectFromWrapper = `
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
`;

const selectContainer = `
  position: absolute;
  top: 3px;
  right: 3px;
  border-radius: 4px;
  background-color: white;
  width: 330px;
  z-index: 15;
`;

const searchInput = `
  width: 100%;
  border: none;
  border-bottom: 1px solid #b6c0cb;
  border-radius: 4px;
  font-size: 20px;
  margin-bottom: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 40px;
`;

const currencyListContainer = `
  overflow: scroll;
  max-height: 300px;
  padding: 5px 0;
`

const currencyList = `
  list-style: none;
  padding: 0 5px;
  margin: 0;
  color: black;
`;

const currencyItem = `
  display: flex;
  padding: 2px 14px;
  cursor: pointer;
  display: flex;
  font-size: 12px;
  align-items: center;
`;

const cointTicker = `
  flex: 2;
  text-transform: uppercase;
  padding-left: 5px;
`;

const cointName = `
  flex: 3;
  color: #ccc;
  text-align: left;
  word-break: break-all;
`;

module.exports = {
  template: `
    <div class="rounded-lg p-3 " style="${mainContainer}">
      <div v-if="selectFromOpen || selectToOpen" style="${selectFromWrapper}" @click="closeSelect"></div>
      <div class="lg:w-4/5 w-full lg:p-2 p-1 flex flex-col lg:flex-row" style="${mainBlock}">
        <div style="${labelsBlock}">
        <h1 style="${mainHeader}">Limitless exchange</h1>
        <p style="${subTitle}">Fast coin swaps free of custody</p>
        <img >
        </div>
        <div style="${formBlock}">
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You send</div>
            <input type="text" v-model.number="amount" @keyup="recountTo" style="${input}"/>
            <div class="cursor-pointer" style="${exchangeInputSearch}" @click="openSelectFrom">
              <img v-if="from" :src="from.image" style="${coinIcon}"> 
              <span class='currency-coin-ticker coin-ticker-to'>{{from ? fromTicker: 'BTC' }}</span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
            <div v-if="selectFromOpen" style="${selectContainer}">
              <input type="text" style="${searchInput}">
              <div style="${currencyListContainer}">
                <ul style="${currencyList}">
                  <li v-for="fromCurrency in fromCurrencies" style="${currencyItem}" v-bind:key="fromCurrency.ticker"
                    class="hover:shadow-md" @click="() => selectCoinFrom(fromCurrency.ticker)">
                    <img :src="fromCurrency.image" style="${coinIcon}"> 
                    <span style="${cointTicker}">{{fromCurrency.ticker}}</span>
                    <span style="${cointName}">{{fromCurrency.name}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style="${sequenceBlock}">
            <div style="${circle}"></div>
            <div style="${line}"></div>
            <span style="${exchangeSequence}">{{sequence}}</span>
            <div style="${toggleButton}" @click="toggleCurrancies"></div>
          </div>
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You get</div>
            <input type="text" disabled style="${input}" :value="isCounting ? '-' : amountTo"/>
            <div class="cursor-pointer" style="${exchangeInputSearch}" @click="openSelectTo">
              <img v-if="to" :src="to.image" style="${coinIcon}">
              <span class='currency-coin-ticker coin-ticker-to'>{{to ? toTicker : 'ETH' }}</span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
            <div v-if="selectToOpen" style="${selectContainer}">
            <input type="text" style="${searchInput}">
            <div style="${currencyListContainer}">
              <ul style="${currencyList}">
                <li v-for="toCurrency in toCurrencies" style="${currencyItem}" v-bind:key="toCurrency.ticker"
                  class="hover:shadow-md" @click="() => selectCoinTo(toCurrency.ticker)">
                  <img :src="toCurrency.image" style="${coinIcon}"> 
                  <span style="${cointTicker}">{{toCurrency.ticker}}</span>
                  <span style="${cointName}">{{toCurrency.name}}</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
          <router-link :to="{ name: 'stepper', params: { amount: 123,  form: 'btc', to: 'eth'}}">stepper</router-link>
          <button class="hover:opacity-75" style="${exchangeButton}">Exchange</button>
        </div>
      </div>
    </div>
  `,
  components: {
    ButtonGeneric: walletApi.components.Button.ButtonGeneric,
    Loader: walletApi.components.Loader
  },
  data () {
    return {
      amount: 1,
      amountTo: 0,
      fromCurrencies: [],
      toCurrencies: [],
      from: null,
      to: null,
      api: {},
      isCounting: false,
      selectFromOpen: false,
      selectToOpen: false
    }
  },

  computed: {
    fromTicker () {
      return this.from.ticker.toUpperCase();
    },
    toTicker ()  {
      return this.to.ticker.toUpperCase();
    },
    sequence () {
      const price = this.amountTo && this.amount ? Number(this.amountTo / this.amount).toFixed(7) : 0;
      return `1 ${this.from ? this.from.ticker.toUpperCase() : 'BTC'} ~ ${price || ''} ${this.to ? this.to.ticker.toUpperCase() : 'ETH'}`
    }
  },

  methods: {
    async getFromCurrencies () {
      try {
        this.fromCurrencies = await this.api.getAllCurrencies();
        this.from = this.fromCurrencies.find(currency => currency.ticker === defaultFrom);
      } catch (error) {

      }
    },
    async getToCurrencies () {
      this.toCurrencies = [];
      this.toCurrencies = await this.api.availableCurrencies(this.from.ticker);
      if (this.to) {
        const isAvalible = this.toCurrencies.find(currency => currency.ticker === this.to.ticker);
        if (!isAvalible) {
          this.to = this.toCurrencies[0];
        }
      } else {
        this.to = this.toCurrencies.find(currency => currency.ticker === defaultTo);
      }  
    },
    async recountTo () {
      this.isCounting = true;
      const fromTo = `${this.from.ticker}_${this.to.ticker}`;
      const amount = this.amount;
      try {
        const { estimatedAmount } = await this.api.exchangeAmount(fromTo, amount);
        this.amountTo = estimatedAmount;
      } catch (error) {
        this.amountTo = 0;
      } finally {
        this.isCounting = false;
      }
    },
    async toggleCurrancies () {
      const prevFrom = this.from;
      this.from = this.to;
      this.to = prevFrom;
      await this.getToCurrencies();
      await this.recountTo();
    },
    openSelectFrom () {
      if (this.fromCurrencies.length) {
        this.selectFromOpen = true;
      }
    },
    openSelectTo () {
      if (this.toCurrencies.length) {
        this.selectToOpen = true;
      }
    },
    closeSelect () {
      this.selectFromOpen = false;
      this.selectToOpen = false;
    },
    selectCoinFrom (ticker) {
      const newFrom = this.fromCurrencies.find(currency => currency.ticker === ticker);
      if (newFrom) {
        this.from = newFrom;
      }
      this.recountTo();
      this.selectFromOpen = false;
    },
    selectCoinTo (ticker) {
      const newTo = this.toCurrencies.find(currency => currency.ticker === ticker);
      if (newTo) {
        this.to = newTo;
      }
      this.recountTo();
      this.selectToOpen = false;
    }
  }, 
  created() {
    this.api = new ApiWorker(walletApi.http);
  },
  async mounted() {
    await this.getFromCurrencies();
    await this.getToCurrencies();
    await this.recountTo();
  },
}

