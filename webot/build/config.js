"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWEI = exports.fromWEI = exports.getTokens = exports.getTokenByAddress = exports.getTokenBySymbol = void 0;
// @ts-ignore
var data_json_1 = __importDefault(require("../data/data.json"));
// @ts-ignore
var common_1 = require("./common");
var fm = common_1.common.formatter;
function getTokenBySymbol(symbol) {
    if (!symbol) {
        return {};
    }
    return (getTokens().find(function (token) { return token.symbol.toLowerCase() === symbol.toLowerCase(); }) || {});
}
exports.getTokenBySymbol = getTokenBySymbol;
function getTokenByAddress(address) {
    if (!address) {
        return {};
    }
    return getTokens().find(function (token) { return token.address.toLowerCase() === address.toLowerCase(); });
}
exports.getTokenByAddress = getTokenByAddress;
//
// function getCustomTokens() {
//     return getTokens().filter(token => token.custom);
// }
function getTokens() {
    // @ts-ignore
    return data_json_1.default.tokens;
}
exports.getTokens = getTokens;
function fromWEI(symbol, valueInWEI, precision) {
    if (precision === void 0) { precision = 4; }
    var token = getTokenBySymbol(symbol);
    if (!token) {
        return 0;
    }
    // @ts-ignore
    var value = fm.toBig(valueInWEI).div("1e" + token.decimals);
    return value.toNumber().toFixed(precision);
}
exports.fromWEI = fromWEI;
function toWEI(symbol, value) {
    var token = getTokenBySymbol(symbol);
    if (!token) {
        return 0;
    }
    // @ts-ignore
    var valueInBN = fm.toBig(value).times("1e" + token.decimals);
    return valueInBN.toString(10);
}
exports.toWEI = toWEI;
exports.default = {
    getTokenBySymbol: getTokenBySymbol,
    getTokenByAddress: getTokenByAddress,
    getTokens: getTokens,
    fromWEI: fromWEI,
    toWEI: toWEI
};
