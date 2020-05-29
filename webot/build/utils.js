"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandom = exports.getAmount = exports.getTokenInfo = exports.randomNum = exports.now = exports.sleep = void 0;
var format_1 = __importDefault(require("date-fns/format"));
var BigNumber = require('bignumber.js');
function sleep(t) {
    new Promise(function (res, rej) { return setTimeout(res, t); });
}
exports.sleep = sleep;
function now() {
    var newdate = new Date();
    var time = format_1.default(newdate, 'yyyy-MM-dd HH:mm:ss');
    return time;
}
exports.now = now;
function randomNum(maxNum, minNum, decimalNum) {
    var max = 0, min = 0;
    minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
    switch (arguments.length) {
        case 1:
            return Math.floor(Math.random() * (max + 1));
            // @ts-ignore
            break;
        case 2:
            return Math.floor(Math.random() * (max - min + 1) + min);
            // @ts-ignore
            break;
        case 3:
            return (Math.random() * (max - min) + min).toFixed(decimalNum);
            // @ts-ignore
            break;
        default:
            return Math.random();
            // @ts-ignore
            break;
    }
}
exports.randomNum = randomNum;
function getTokenInfo(balance, tokenId) {
    for (var _i = 0, balance_1 = balance; _i < balance_1.length; _i++) {
        var tokenInfo = balance_1[_i];
        if (tokenInfo.tokenId == tokenId) {
            return tokenInfo;
        }
    }
    return undefined;
}
exports.getTokenInfo = getTokenInfo;
function getAmount(amount, dig) {
    if (dig === void 0) { dig = 1e18; }
    return new BigNumber(amount).div(dig).toString(10);
}
exports.getAmount = getAmount;
function getRandom() {
    return Math.random();
}
exports.getRandom = getRandom;
exports.default = {
    randomNum: randomNum,
    sleep: sleep,
    now: now,
    getAmount: getAmount,
    getTokenInfo: getTokenInfo,
    getRandom: getRandom,
};
