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
  border: 2px solid white;
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


module.exports = {
  mainContainer,
  mainHeader,
  subTitle,
  mainBlock,
  block,
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
  toggleButton
}