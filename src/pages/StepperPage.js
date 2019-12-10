const ApiWorker = require('../apiWorker');
const style = require('./mainPageStyles');
const stepperStyle = require('./stepperStyles');
const { defaultFrom, defaultTo, errorType, longName, statuses, finishedStatuses } = require('../constants');
const { valiateAddress, valiateExternalId } = require('../utils/validators');

const {
  exchangeInputTitle,
  sequenceBlock,
  toggleButton,
  coinIcon,
  selectFromWrapper,
  searchInput,
  currencyListContainer,
  currencyList,
  currencyItem,
  coinName,
  coinTicker,
  inputLoader,
  sreachIcon,
  subName,
} = style;

const {
	mainContainer,
	arrow,
	Stepper,
	stepContainer,
	stepHeader,
	stepNumber,
	stepName,
	stepBody,
	formBlock,
	input,
	inputWrapper,
	exchangeInputSearch,
	circle,
	line,
	exchangeSequence,
	selectContainer,
	addressInput,
	addressInputBody,
	inputSuccesValid,
	addressInputLabel,
	addressInputWrapper,
	stepButton,
	buttonGreen,
	buttonWhite,
	disabledButton,
	confirmInfoLabel,
	confirmInfoSub,
	confirmInfoData,
	confirmInfoAmount,
	confirmArrow,
	confirmCheckboxWrapper,
	checkboxBody,
	checkbox,
	checkboxChecked,
	buttonsBlock,
	refundButton,
	inputError,
	exchangeInputError,
	stepThreeBlock,
	infoHeader,
	infoContent
} = stepperStyle;

const { faArrowsAltV, faSpinner, faLongArrowAltDown, faLongArrowAltUp, faSearch, faArrowRight, faCheck, faCheckCircle, faTimesCircle } = walletApi.fontAwesomeIcons;
// const { faArrowsAltV, faSpinner, faLongArrowAltDown, faLongArrowAltUp, faSearch, faArrowRight, faCheck } = walletApi.icons.icons;

module.exports = {
  template: `
    <div class="rounded-lg p-3 " style="${mainContainer}">
      <div v-if="initializing">
        <Loader />
      </div>
      <div v-else style="${Stepper}">
        <div v-if="selectFromOpen || selectToOpen" style="${selectFromWrapper}" @click="closeSelect"></div>
        <div v-if="currentStep === 1" style="${stepContainer}">
          <div style="${stepHeader}">
            <div style="${stepNumber}">1</div>
            <span style="${stepName}">Send To</span>
          </div>
          <div style="${stepBody}">
            <div style="${formBlock}">
              <div style="${inputWrapper}">
                <div v-if="amountError" style="${exchangeInputError}">{{renderFromLabel}}</div>
                <div v-else style="${exchangeInputTitle}">You send</div>
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
            </div>

            <div v-if="to && to.ticker === 'ark' && arkWallets.length" style="${addressInputBody}">
              <span>Recipient Wallet</span>
              <InputSelect :items="arkWallets" label="" name="ArkWallets"  v-model="recipientWallet"/>
            </div>
            <div v-else class="relative" style="${addressInputBody}">
              <span style="${addressInputLabel}">Recipient Wallet</span>
              <span v-if="fullFrom && !fullFrom.isAnonymous" 
              class="absolute text-xs hover:text-green cursor-pointer" style="${refundButton}" @click="toggleRefund">
                {{needRefund ? 'Remove refund address' : '+ Add refund address'}}
              </span>
              <div style="${addressInputWrapper}">
                <input  
                  type="text" 
                  v-model="recipientWallet"
                  @blur="() => recipientFocus = false"
                  @focus="() => recipientFocus = true"
                  class="border border-solid focus:border-green border-gray-400" 
                  style="${addressInput}" 
                  :placeholder="recipientPlace"/>
                  <div v-if="recipientWallet && isValidRecipient" style="${inputSuccesValid}"><font-awesome-icon  :icon="faCheck" size="lg"/></div>
              </div>
              <p v-if="recipientWallet && !isValidRecipient && !recipientFocus" 
                class="text-xs" 
                style="${inputError}">
                This address is not valid
              </p>
            </div>
            <div v-if="fullTo && fullTo.hasExternalId" class="relative"  style="${addressInputBody}">
              <div style="${addressInputWrapper}">
                <input 
                  type="text" 
                  v-model="externalId" 
                  @blur="() => externalIdFocus = false"
                  @focus="() => externalIdFocus = true"
                  class="border border-solid focus:border-green border-gray-400"
                  style="${addressInput}" 
                  :placeholder="exstraIdPalce"/>
                  <div v-if="externalId && isValidExternalId" style="${inputSuccesValid}"><font-awesome-icon  :icon="faCheck" size="lg"/></div>
              </div>
              <p v-if="externalId && !isValidExternalId && !externalIdFocus" 
                class="text-xs" style="${inputError}">{{exstraIdValidError}}</p>
            </div>
            <div v-if="needRefund || fullFrom && fullFrom.isAnonymous" class="relative" style="${addressInputBody}">
              <span style="${addressInputLabel}">Refund Wallet</span>
              <div style="${addressInputWrapper}">
                <input 
                  type="text" 
                  v-model="refundWallet"
                  @blur="() => refundFocus = false"
                  @focus="() => refundFocus = true"
                  style="${addressInput}"
                  class="border border-solid focus:border-green border-gray-400" 
                  :placeholder="refundPlace"/>
                  <div v-if="refundWallet && isValidRefund" style="${inputSuccesValid}"><font-awesome-icon  :icon="faCheck" size="lg"/></div>
              </div>
              <p v-if="refundWallet && !isValidRefund && !refundFocus"
                class="text-xs" style="${inputError}">This address is not valid</p>
            </div>
          </div>
          <div style="${buttonsBlock}">
            <button v-if="!validParams" style="${stepButton} ${disabledButton}" 
            class="hover:opacity-75 disabled:bg-gray" :disabled="!validParams" 
            >Next</button>
            <button v-else style="${stepButton} ${buttonGreen}" 
            class="hover:opacity-75 disabled:bg-gray" :disabled="!validParams" 
            @click.prevent="switchToTwoStep">Next</button>
            <router-link :to="{ name: 'change-now'}">
              <button class="hover:opacity-75" style="${stepButton} ${buttonWhite}">Back</button>
            </router-link>  
          </div>
        </div>
        <div v-if="currentStep === 2" style="${stepContainer}">
          <div style="${stepHeader}">
            <div style="${stepNumber}">2</div>
            <span style="${stepName}">Confirmation</span>
          </div>
          <div style="${stepBody}">
            <div class="flex flex-col md:flex-row md:items-center">
              <div style="${confirmInfoData}" class="pr-6">
                <span style="${confirmInfoLabel}">You Send</span>
                <span style="${confirmInfoAmount}">{{amount}} {{from.ticker}}</span>
                <span style="${confirmInfoSub}">{{sequence}}</span>
              </div>
              <div style="${confirmArrow}" class="md:block hidden">
                <font-awesome-icon :icon="faArrowRight" size="lg"/>
              </div>
              <div style="${confirmInfoData}" class="md:pl-6">
                <span style="${confirmInfoLabel}">You Get</span>
                <span style="${confirmInfoAmount}">≈ {{amountTo}} {{to.ticker}}</span>
                <span style="${confirmInfoSub}">{{recipientWallet}}</span>
              </div>
            </div>
            <div style="margin: 20px 0;">
              <p style="${confirmInfoLabel} margin-bottom: 5px;">Estimated Arrival</p>
              <p style="${confirmInfoSub}">≈ {{transactionTime}} minutes</p>
            </div>
          </div>
          <div style="${confirmCheckboxWrapper}">
            <label style="${checkboxBody}" class="cursor-pointer">
              <input type="checkbox" v-model="confirm" style="${checkbox}">
              <span v-if="confirm" style="${checkboxChecked}"><font-awesome-icon  :icon="faCheck" size="lg"/></span>
            </label>
            <div style="confirmText">
              <span>I've read and agree to the ChangeNOW 
                <a class="no-underline"  style="color: #3bee81;" href="https://changenow.io/terms-of-use" target="blank">Terms of Use</a> and 
                <a class="no-underline" style="color: #3bee81;"  href="https://changenow.io/privacy-policy" target="blank">Privacy Policy</a>
              </span>
            </div>
          </div>
          <div style="${buttonsBlock}">
            <button v-if="!confirm" style="${stepButton} ${disabledButton}" :disabled="!confirm">Confirm</button>
            <button v-else style="${stepButton} ${buttonGreen}" @click.prevent="createExchange">Confirm</button>
            <button style="${stepButton} ${buttonWhite}" @click.prevent="switchToOneStep">Back</button>
          </div>
        </div>
        <div v-if="currentStep === 3 && transaction" style="${stepContainer}">
          <div style="${stepHeader}">
            <div style="${stepNumber}">3</div>
            <span style="${stepName} color: #a4a3aa">Sending</span>
            <span class="m-4" style="color: #a4a3aa; font-size: 16px;">Transaction Id: {{transaction.id}}</span>
          </div>
          <div style="${stepBody}">
            <div style="border: 2px solid #3bee81; padding: 5px 65px 5px 10px; max-width: 650px;" class="mb-4">
              <div style="${stepThreeBlock}">
                <p style="${infoHeader}">You send</p>
                <p style="${infoContent} text-transform:uppercase;">{{transaction.expectedSendAmount}} {{transaction.fromCurrency}}</p>
              </div>
              <div style="${stepThreeBlock}">
                <p style="${infoHeader}">To address</p>
                <p style="${infoContent}">{{transaction.payinAddress}} <ButtonClipboard :value="transaction.payinAddress" class="text-theme-page-text-light mx-2"/></p>
              </div>
              <div style="${stepThreeBlock}" v-if="transaction.payinExtraId">
                <p style="${infoHeader}">{{transaction.payinExtraIdName}}</p>
                <p style="${infoContent}">{{transaction.payinExtraId}} <ButtonClipboard :value="transaction.payinExtraId" class="text-theme-page-text-light mx-2"/></p>
              </div>
            </div>
            <div style="padding: 5px 65px 5px 10px;" class="mb-4">
              <div style="${stepThreeBlock}">
                <p style="${infoHeader}">You get</p>
                <p style="${infoHeader} font-size: 18px; text-transform:uppercase;"> ≈ {{transaction.expectedReceiveAmount}} {{transaction.toCurrency}}</p>
              </div>
              <div style="${stepThreeBlock}">
                <p style="${infoHeader}">To address</p>
                <p style="${infoHeader} font-size: 18px; word-break: break-all;">{{transaction.payoutAddress}}</p>
              </div>
            </div>
            <div v-if="!isTransactionFinished" style="exchangeStatuses" class="flex items-center justify-center flex-col md:flex-row">
              <div style="height: 35px; border: 2px solid rgba(61,61,112,.04);" class="md:w-1/3 w-full mb-1 md:mx-1  flex items-center justify-center">
                <font-awesome-icon v-if="confirmingStatus" :icon="faCheckCircle" size="lg" style="color: #3bee81;"/>
                <font-awesome-icon v-else :icon="spinner" size="lg" rotation="180" spin style="color: #3bee81;"/>
                <span class="ml-2">Awaiting deposit</span>
              </div>
              <div style="height: 35px; border: 2px solid rgba(61,61,112,.04);" class="md:w-1/3 w-full mb-1 md:mx-1  flex items-center justify-center">
                <font-awesome-icon v-if="exchangingStatus" :icon="faCheckCircle" size="lg" style="color: #3bee81;"/>
                <font-awesome-icon v-else :icon="spinner" size="lg" rotation="180" spin style="color: #3bee81;"/>
                <span class="ml-2">Exchanging</span>
              </div>
              <div style="height: 35px; border: 2px solid rgba(61,61,112,.04);" class="md:w-1/3 w-full mb-1 md:mx-1 flex items-center justify-center">
                <font-awesome-icon v-if="sendingStatus" :icon="faCheckCircle" size="lg" style="color: #3bee81;"/>
                <font-awesome-icon v-else :icon="spinner" size="lg" rotation="180" spin style="color: #3bee81;"/>
                <span class="ml-2">Sending to your wallet</span>
              </div>
            </div>
            <div v-if="transaction.status === statuses.failed" class="px-4 py-3 rounded my-1" style="background-color: #fff5f5;	">
              <span class="block sm:inline" style="color: #e53e3e;">Error during exchange. Please contact support.</span>
            </div>
            <div v-if="transaction.status === statuses.finished" class="px-4 py-3 rounded my-1" style="background-color: #f0fff4;	">
              <span class="block sm:inline" style="color: #38a169;">Exchange completed.</span>
            </div>
            <div v-if="transaction.status === statuses.finished" style="padding: 5px 65px 5px 10px;" class="mb-4">
              <div style="${stepThreeBlock}">
                <p style="${infoHeader} font-weight: 600;">Input Transaction Hash</p>
                <p style="${infoHeader} font-size: 18px; word-break: break-all;">{{transaction.payinHash}}</p>
              </div>
              <div style="${stepThreeBlock}">
                <p style="${infoHeader} font-weight: 600;">Output Transaction Hash</p>
                <p style="${infoHeader} font-size: 18px;  word-break: break-all;">{{transaction.payoutHash}}</p>
              </div>
            </div>
            <button @click="startNewTransaction">Start new transaction</button>
          </div>
        </div>
      </div>
    </div>
  `,
  components: {
    // 'font-awesome-icon': walletApi.icons.component,
    // Loader: walletApi.components.Loader,
    // InputSelect: walletApi.components.Input.InputSelect
  },
  data () {
    return {
      faCheck: faCheck,
      spinner: faSpinner,
      arrow: faArrowsAltV,
      upArrow: faLongArrowAltUp,
      downArrow: faLongArrowAltDown,
      faSearch: faSearch,
      faArrowRight: faArrowRight,
      faCheckCircle: faCheckCircle,
      faTimesCircle: faTimesCircle,

      amount: 0.1,
      amountTo: 0,
      currentStep: 1,
      currencies: [],
      from: null,
      to: null,
      fullTo: null,
      fullFrom: null,
      api: {},
      isCounting: false,
      selectFromOpen: false,
      selectToOpen: false,
      recountTimer: null,
      counter: 1,
      recountTimeout: null,
      arkWallets: [],
      recipientWallet: '',
      refundWallet: '',
      externalId: '',
      initializing: true,
      confirm: false,
      fromFilter: '',
      toFilter: '',
      needRefund: false,
      recipientFocus: false,
      refundFocus: false,
      externalIdFocus: false,

      hasError: false,
      amountError: false,
      minAmount: 0,
      transactionTime: '',
      longName: {},
      isEnabled: false,
      // Step 3
      transaction: null,
      creating: false,
      statusTimer: null,
      finishedStatuses,
      statuses,
    }
  },

  computed: {
    isLongToName () {
      return this.to && this.longName[this.to.ticker];
    },
    isLongFromName () {
      return this.from && this.longName[this.from.ticker];
    },
    isValidRecipient () {
      return this.to ? valiateAddress(this.to.ticker, this.recipientWallet) : false;
    },
    isValidRefund () {
      return this.from ? valiateAddress(this.from.ticker, this.refundWallet) : false;
    },
    isValidExternalId () {
      return this.to ? valiateExternalId(this.to.ticker, this.externalId) : false;
    },
    renderFromLabel () {
      return this.from && this.amountError ? `Minimum amount ${this.minAmount} ${this.from.ticker.toUpperCase()}` : ''
    },
    exstraIdPalce () {
      return this.fullTo && this.fullTo.externalIdName ? `${this.fullTo.externalIdName} (Optional)` : '';
    },
    exstraIdValidError () {
      return this.fullTo && this.fullTo.externalIdName ? `This ${this.fullTo.externalIdName.toLowerCase()} is not valid` : '';
    },
    recipientPlace () {
      return this.to ? `Enter the recipient's ${this.to.ticker.toUpperCase()} address` : '';
    },
    refundPlace () {
      return this.fullFrom ? 
        `Enter ${this.fullFrom.ticker.toUpperCase()} refund address (${this.fullFrom.isAnonymous ? 'required' : 'optional'})` : '';
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
    validParams () {
      if (this.from && this.to && this.amount) {
        const isValidRecipient = this.recipientWallet && valiateAddress(this.to.ticker, this.recipientWallet);
        const isValidRefund = this.fullFrom && this.fullFrom.isAnonymous || this.refundWallet ? 
          valiateAddress(this.from.ticker, this.refundWallet) : true;
        const isValidExternalId = this.fullTo && !this.fullTo.hasExternalId || this.externalId && valiateExternalId(this.to.ticker, this.externalId);
        return Boolean(isValidRecipient && isValidRefund && isValidExternalId && !this.hasError && !this.amountError);
      }
      return false
    },
    confirmingStatus () {
      if (this.transaction) {
        const { status } = this.transaction;
        return status === statuses.confirming || status === statuses.exchanging || status === statuses.sending;
      } 
      return false;
    },
    exchangingStatus () {
      if (this.transaction) {
        const { status } = this.transaction;
        return status === statuses.exchanging || status === statuses.sending;
      } 
      return false;
    },
    sendingStatus () {
      if (this.transaction) {
        const { status } = this.transaction;
        return status === statuses.sending;
      } 
      return false;
    },
    isTransactionFinished () {
      if (this.transaction) {
        const { status } = this.transaction;
        return this.finishedStatuses.includes(status);
      } 
      return false;
    }
  },
  methods: {
    toggleRefund () {
      this.needRefund = !this.needRefund;
      this.refundWallet = '';
    },
    async getFromCurrencies () {
      this.currencies = await this.api.getAllCurrencies();
      if (this.from) {
        return;
      }
      const from = this.currencies.find(currency => currency.ticker === defaultFrom);
      this.from = from;
    },
    getToCurrencies () {
      if (!this.to) {
        const to = this.currencies.find(currency => currency.ticker === defaultTo);
        this.to = to ? to : this.currencies.filter(currency => currency.ticker !== this.from.ticker)[0];
      }
    },
    async recountTo () {
      if (this.from && this.to) {
        this.isCounting = true;
        const fromTo = `${this.from.ticker}_${this.to.ticker}`;
        const amount = this.amount;
        try {
          this.fullFrom = await this.api.getCurrencyInfo(this.from.ticker);
          this.fullTo = await this.api.getCurrencyInfo(this.to.ticker);
          const { minAmount } = await this.api.minilalExchangeAmount(fromTo);
          this.minAmount = minAmount;
          if (minAmount > amount) {
            this.amountError = true;
            return;
          }
          this.amountError = false;
          const { estimatedAmount, transactionSpeedForecast } = await this.api.exchangeAmount(fromTo, amount);
          this.transactionTime = transactionSpeedForecast;
          this.amountTo = estimatedAmount;
          this.hasError = false;
        } catch (error) {
          this.amountTo = 0;
          this.hasError = true;
          if (error.body) {
            const errorData = JSON.parse(error.body);
            if (errorData.error === errorType.SMALL_DEPOSIT) {
              this.amountError = true;
              return;
            }
            if (errorData.error === errorType.INACTIVE) {
              const errorMessage = `The ${this.from.ticker.toUpperCase()}/${this.to.ticker.toUpperCase()} 
                pair is temporarily unavailable for exchanges.`;
              walletApi.alert.error(errorMessage);
              return;
            }
          }
          if (error.message) {
            walletApi.alert.error(`Faled to fetch available currencies. Reason: ${error.message}.`);
            return;
          }
          walletApi.alert.error('Unknown error.');
        } finally {
          this.isCounting = false;
        }
      }
    },
    startRecount () {
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
      this.externalId = '';
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
      }
      this.recountTo();
      this.closeSelect();
    },
    selectCoinTo (ticker) {
      const newTo = this.currencies.find(currency => currency.ticker === ticker);
      if (newTo) {
        this.to = newTo;
        this.externalId = '';
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
    async createExchange () {
      if (this.validParams) {
        const params = {
          from: this.from.ticker,
          to: this.to.ticker,
          address: this.recipientWallet,
          amount: this.amount,
        }

        if (this.externalId) { params.extraId = this.externalId; }
        if (this.refundWallet) { params.refundAddress = this.refundWallet; }
        this.creating = true;
        try {
          this.statusTimer = walletApi.timers.setInterval(() => {
            this.checkTransactionStatus();
          }, 5000);
          const transaction = await this.api.createTransaction(params);
          walletApi.storage.set('transactionId', transaction.id);
          this.transaction = transaction;
          await this.checkTransactionStatus();
          this.currentStep = 3;
        } catch (error) {
          walletApi.alert.error(`Faled to create transaction.`);
        } finally {
          this.creating = false;
        }
      }
    },
    async checkTransactionStatus () {
      if (!this.transaction) {
        return;
      }
      const { id } = this.transaction;
      const transactionData = await this.api.getTransactionStatus(id);

      this.transaction = transactionData;
      if (finishedStatuses.includes(transactionData.status)) {
        walletApi.storage.set('transactionId', null);
        walletApi.timers.clearInterval(this.statusTimer);
      }
    },
    async initialize () {
      this.initializing = true;
      const storageFrom = walletApi.storage.get('fromCurrency')
      const storageAmount = walletApi.storage.get('amount');
      const storageTo = walletApi.storage.get('toCurrency');
      const lastId = walletApi.storage.get('transactionId'); 
      if (lastId) {
        this.statusTimer = walletApi.timers.setInterval(() => {
          this.checkTransactionStatus();
        }, 5000);
        this.transaction = {
          id: lastId
        };
        await this.checkTransactionStatus();
        this.currentStep = 3;
        this.initializing = false;
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
      } catch (error) {
        if (error.message) {
          walletApi.alert.error(`Faled to fetch available currencies. Reason: ${error.message}.`);
          return;
        }
        if (error.body) {
          const { message } = JSON.parse(error.body);
          walletApi.alert.error(message);
          return
        }
        walletApi.alert.error('Unknown error.');
      } finally {
        this.initializing = false;
      }
    },
    switchToTwoStep () {
      this.currentStep = 2;
    },
    switchToOneStep () {
      this.currentStep = 1;
    },
    startNewTransaction () {
      walletApi.storage.set('transactionId', null);
      walletApi.route.goTo('change-now');
    }
  }, 
  created() {
    this.api = new ApiWorker(walletApi.http);
  },
  async mounted() {
    console.log(walletApi);
    this.longName = longName;
    const profile = walletApi.profiles.getCurrent()
    this.arkWallets = profile.wallets.map(wallet => wallet.address);
    await this.initialize();
  },
}
