const ApiWorker = require('../apiWorker');
const style = require('./mainPageStyles');
const { defaultFrom, defaultTo, longName } = require('../constants');

const {
  mainContainer,
  mainHeader,
  subTitle,
  mainBlock,
  labelsBlock,
  formBlock,
  inputWrapper,
  exchangeButton,
  input,
  exchangeInputTitle,
  exchangeInputSearch,
  arrow,
  sequenceBlock,
  circle,
  line,
  exchangeSequence,
  toggleButton,
  coinIcon,
  selectFromWrapper,
  selectContainer,
  searchInput,
  currencyListContainer,
  currencyList,
  currencyItem,
  coinName,
  coinTicker,
  inputLoader,
  sreachIcon,
  subName
} = style;


const { faArrowsAltV, faSpinner, faLongArrowAltDown, faLongArrowAltUp, faSearch } = walletApi.fontAwesomeIcons;
// const { faArrowsAltV, faSpinner, faLongArrowAltDown, faLongArrowAltUp, faSearch } = walletApi.icons.icons;


module.exports = {
  template: `
    <div class="rounded-lg p-3 " style="${mainContainer}">
      <div v-if="selectFromOpen || selectToOpen" style="${selectFromWrapper}" @click="closeSelect"></div>
      <div v-if="initializing">
        <Loader />
      </div>
      <div v-else class="lg:w-4/5 w-full lg:p-2 p-1 flex flex-col lg:flex-row" style="${mainBlock}">
        <div style="${labelsBlock}">
        <h1 style="${mainHeader}">Limitless exchange</h1>
        <p style="${subTitle}">Fast coin swaps free of custody</p>
        <img >
        </div>
        <div style="${formBlock}">
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You send</div>
            <input type="text" v-model.number="amount" @keyup="startRecount" style="${input}" @input="isNumber($event)"/>
            <div class="cursor-pointer" style="${exchangeInputSearch}" @click="openSelectFrom">
              <img v-if="from" :src="from.image" style="${coinIcon}"> 
              <span v-if="from && isLongFromName">
                {{longName[from.ticker].ticker}}<sup style="${subName}">{{longName[from.ticker].sub}}</sup>
              </span>
              <span v-else class='currency-coin-ticker coin-ticker-to'>
                {{fromTicker}}
              </span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
            <div v-if="selectFromOpen" style="${selectContainer}">
              <div style="${sreachIcon}"><font-awesome-icon :icon="faSearch" size="lg"/></div>
              
              <input type="text" style="${searchInput}" ref="searchFrom" v-model="fromFilter">
              <div style="${currencyListContainer}">
                <ul style="${currencyList}">
                  <li v-for="fromCurrency in filtredFrom" style="${currencyItem}" v-bind:key="fromCurrency.ticker"
                    class="hover:shadow-md" @click="() => selectCoinFrom(fromCurrency.ticker)">
                    <img :src="fromCurrency.image" style="${coinIcon}"> 
                    <span style="${coinTicker}">{{fromCurrency.ticker}}</span>
                    <span style="${coinName}">{{fromCurrency.name}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style="${sequenceBlock}">
            <div style="${circle}"></div>
            <div style="${line}"></div>
            <span style="${exchangeSequence}">{{sequence}}</span>
            <a href="https://changenow.io/faq/what-is-the-expected-exchange-rate" target="blank" class="no-underline pl-3"
            style="color: #3bee81; font-size: 12px;">Expected rate</a>
            <div style="${toggleButton}" @click="toggleCurrancies">
              <font-awesome-icon :icon="upArrow" size="lg"/>
              <font-awesome-icon :icon="downArrow" size="lg"/>
            </div>
          </div>
          <div style="${inputWrapper}">
            <div style="${exchangeInputTitle}">You get</div>
            <input type="text" disabled style="${input}" :value="isCounting ? '' : amountTo"/>
            <span v-if="isCounting" style="${inputLoader}">
              <font-awesome-icon :icon="spinner" size="lg" rotation="180" spin/>
            </span>
            <div class="cursor-pointer" style="${exchangeInputSearch}" @click="openSelectTo">
              <img v-if="to" :src="to.image" style="${coinIcon}">
              <span v-if="to && isLongToName">
              {{longName[to.ticker].ticker}}<sup style="${subName}">{{longName[to.ticker].sub}}</sup>
              </span>
              <span v-else>
                {{toTicker}}
              </span>
              <div class="currencies-container currencies-to-container"></div>
              <div style="${arrow}"></div>
            </div>
            <div v-if="selectToOpen" style="${selectContainer}">
            <div style="${sreachIcon}"><font-awesome-icon :icon="faSearch" size="lg"/></div>
            <input type="text" style="${searchInput}" ref="searchTo" v-model="toFilter">
            <div style="${currencyListContainer}">
              <ul style="${currencyList}">
                <li v-for="toCurrency in filtredTo" style="${currencyItem}" v-bind:key="toCurrency.ticker"
                  class="hover:shadow-md" @click="() => selectCoinTo(toCurrency.ticker)">
                  <img :src="toCurrency.image" style="${coinIcon}"> 
                  <span style="${coinTicker}">{{toCurrency.ticker}}</span>
                  <span style="${coinName}">{{toCurrency.name}}</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
          <router-link :to="{ name: 'stepper'}">
            <button class="hover:opacity-75" style="${exchangeButton}">Exchange</button>
          </router-link>
        </div>
      </div>
    </div>
  `,
  components: {
    // 'font-awesome-icon': walletApi.icons.component,
    // Loader: walletApi.components.Loader
  },
  data () {
    return {
      spinner: faSpinner,
      arrow: faArrowsAltV,
      upArrow: faLongArrowAltUp,
      downArrow: faLongArrowAltDown,
      faSearch: faSearch,
      
      amount: 0.1,
      amountTo: 0,
      currencies: [],
      from: null,
      to: null,
      api: {},
      isCounting: false,
      selectFromOpen: false,
      selectToOpen: false,
      recountTimer: null,
      recountTimeout: null,
      initializing: true,
      fromFilter: '',
      toFilter: '',
      longName: {}
    }
  },

  computed: {
    isLongToName () {
      return this.to && this.longName[this.to.ticker];
    },
    isLongFromName () {
      return this.from && this.longName[this.from.ticker];
    },
    fromTicker () {
      return this.from ? this.from.ticker.toUpperCase() : defaultFrom;
    },
    toTicker ()  {
      return this.to ? this.to.ticker.toUpperCase(): defaultTo;
    },
    sequence () {
      const price = this.amountTo && this.amount ? Number(this.amountTo / this.amount).toFixed(7) : 0;
      return `1 ${this.from ? this.from.ticker.toUpperCase() : 'BTC'} ≈ ${price || ''} ${this.to ? this.to.ticker.toUpperCase() : 'ETH'}`
    },
    filtredFrom () {
      const filter = this.fromFilter.toLowerCase().trim();
      return this.currencies.filter(currency => {
        const name = currency.name.toLowerCase();
        const ticker = currency.ticker.toLowerCase();
        const isNotTo = this.to && currency.ticker !== this.to.ticker;
        return (ticker.includes(filter) || name.includes(filter)) && !currency.isFiat && isNotTo;
      });
    },
    filtredTo () {
      const filter = this.toFilter.toLowerCase().trim();
      return this.currencies.filter(currency => {
        const name = currency.name.toLowerCase();
        const ticker = currency.ticker.toLowerCase();
        const isNotFrom = this.from && currency.ticker !== this.from.ticker;
        return (ticker.includes(filter) || name.includes(filter)) && !currency.isFiat && isNotFrom;
      });
    },
  },

  methods: {
    async getFromCurrencies () {
      try {
        this.currencies = await this.api.getAllCurrencies();
        if (this.from) {
          return;
        }
        const from = this.currencies.find(currency => currency.ticker === defaultFrom);
        this.from = from;
        walletApi.storage.set('fromCurrency', from);
      } catch (error) {
        walletApi.alert.error('Error');
      }
    },
    getToCurrencies () {
      if (!this.to) {
        const to = this.currencies.find(currency => currency.ticker === defaultTo);
        this.to = to ? to : this.currencies.filter(currency => currency.ticker !== this.from.ticker)[0];
        walletApi.storage.set('toCurrency', to);
      }
    },
    async recountTo () {
      if (this.from && this.to) {
        this.isCounting = true;
        const fromTo = `${this.from.ticker}_${this.to.ticker}`;
        const amount = this.amount;
        try {
          const { estimatedAmount, transactionSpeedForecast } = await this.api.exchangeAmount(fromTo, amount);
          this.amountTo = estimatedAmount;
        } catch (error) {
          this.amountTo = 0;
        } finally {
          this.isCounting = false;
        }
      }
    },
    startRecount () {
      walletApi.storage.set('amount', this.amount);
      if (this.recountTimeout) {
        walletApi.timers.clearTimeout(this.recountTimeout)
      }
      this.recountTimeout = walletApi.timers.setTimeout(() => {
        this.recountTo();
      }, 500);
    },
    toggleCurrancies () {
      const prevFrom = this.from;
      this.from = this.to;
      this.to = prevFrom;
      walletApi.storage.set('fromCurrency', this.from);
      walletApi.storage.set('toCurrency', this.to);
      this.recountTo();
    },
    openSelectFrom () {
      if (this.currencies.length) {
        this.selectFromOpen = true;
        // this.$refs.searchFrom.$el.focus();
      }
    },
    openSelectTo () {
      if (this.currencies.length) {
        this.selectToOpen = true;
        // this.$refs.searchTo.$el.focus();
      }
    },
    closeSelect () {
      this.toFilter = '';
      this.fromFilter = '';
      this.selectFromOpen = false;
      this.selectToOpen = false;
    },
    selectCoinFrom (ticker) {
      const newFrom = this.currencies.find(currency => currency.ticker === ticker);
      if (newFrom) {
        this.from = newFrom;
        walletApi.storage.set('fromCurrency', newFrom);
      }
      this.recountTo();
      this.closeSelect();
    },
    selectCoinTo (ticker) {
      const newTo = this.currencies.find(currency => currency.ticker === ticker);
      if (newTo) {
        this.to = newTo;
        walletApi.storage.set('toCurrency', newTo);
      }
      this.recountTo();
      this.closeSelect();
    },
    isNumber (event) {
      const value = event.target.value.trim();
      const amount = Number(event.target.value);
      if (Number.isNaN(amount)) {
        event.preventDefault();
        event.target.value = value.slice(0, -1);   
        this.amount = value.slice(0, -1);
        return false;
      } else {
        return true;
      }
    },
    async initialize () {
      this.initializing = true;
      const storageFrom = walletApi.storage.get('fromCurrency')
      const storageAmount = walletApi.storage.get('amount');
      const storageTo = walletApi.storage.get('toCurrency');
      const lastId = walletApi.storage.get('transactionId'); 
      if (lastId) {
        walletApi.route.goTo('stepper');
        return;
      }
      
      if (storageFrom) {
        this.from = storageFrom;
      }
      if (storageTo) {
        this.to = storageTo;
      }
      if (storageAmount) {
        this.amount = storageAmount;
      }
      try {
        await this.getFromCurrencies();
        this.getToCurrencies();
        await this.recountTo();
        this.initializing = false;
      } finally {
        this.initializing = false;
      }
    }
  }, 
  created() {
    this.api = new ApiWorker(walletApi.http);
  },
  async mounted() {
    console.log(walletApi);
    this.longName = longName;
    await this.initialize();
  },
}

