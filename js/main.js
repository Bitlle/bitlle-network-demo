const ethUtil = require('ethereumjs-util');
const Eth = require('ethjs');
const device = require('current-device');
const Cookies = require('js-cookie');
const Web3 = require('web3');
const Buffer = require('buffer/').Buffer;

window.Eth = Eth;
window.ethUtil = ethUtil;
window.Cookies = Cookies;
window.Buffer = Buffer;