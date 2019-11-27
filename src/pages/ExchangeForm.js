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

const toggleButton = ``;

const coinIcon = `
  width: 20px;
  margin-right: 5px;
  filter: invert(95%) sepia(57%) saturate(4466%) hue-rotate(69deg) brightness(86%) contrast(85%);
`;

module.exports = {
  template: `
    <div class="rounded-lg p-3 " style="${mainContainer}">
      <div class="lg:w-4/5 w-full lg:p-2 p-1 flex flex-col lg:flex-row" style="${mainBlock}">
        <div style="${labelsBlock}">
        <h1 style="${mainHeader}">Limitless exchange</h1>
        <p style="${subTitle}">Fast coin swaps free of custody</p>
        <img >
        </div>
        <div style="${formBlock}">
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You send</div>
            <input type="text" v-model.number="amount" style="${input}"/>
            <div class="cursor-pointer" style="${exchangeInputSearch}">
              <img v-if="from" :src="from.image" style="${coinIcon}"> 
              <span class='currency-coin-ticker coin-ticker-to'>{{from ? from.ticker : 'TC'}}</span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
          </div>
          <div style="${sequenceBlock}">
            <div style="${circle}"></div>
            <div style="${line}"></div>
            <span style="${exchangeSequence}">1 BTC ~ 48.178757 ETH</span>
            <div style="${toggleButton}">><</div>
          </div>
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You get</div>
            <input type="text" disabled style="${input}" :value="amountTo"/>
            <div class="cursor-pointer" style="${exchangeInputSearch}">
              <img v-if="to" :src="to.image" style="${coinIcon}">
              <span class='currency-coin-ticker coin-ticker-to'>{{to ? to.ticker : 'TH'}}</span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
          </div>
          <button class="hover:opacity-75" style="${exchangeButton}">Exchange</button>
        </div>
      </div>
    </div>
  `,
  components: {
    ButtonGeneric: walletApi.components.Button.ButtonGeneric,
  },
  data () {
    return {
      amount: 1,
      amountTo: 0,
      currencies: [],
      from: null,
      to: null,
      api: {}
    }
  },

  computed: {
  },

  methods: {
    async getCurrencies () {
      try {
        this.currencies = await this.api.getAllCurrencies();
        this.from = this.currencies.find(currency => currency.ticker === defaultFrom);
        this.to = this.currencies.find(currency => currency.ticker === defaultTo);
      } catch (error) {

      }
    },
    toggleCurr () {
      this.cur = '1ssssss';
    }
  }, 
  created() {
    this.api = new ApiWorker(walletApi.http);
  },
  mounted() {
    this.getCurrencies();
  },
}

