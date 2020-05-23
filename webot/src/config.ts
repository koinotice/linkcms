// @ts-ignore
import config from "../data/data.json";
// @ts-ignore
import {common} from "./common";
const fm=common.formatter

export function getTokenBySymbol(symbol: string) {
    if (!symbol) {
        return {};
    }
    return (
        getTokens().find(
            (            token: { symbol: string; }) => token.symbol.toLowerCase() === symbol.toLowerCase()
        ) || {}
    );
}

export function getTokenByAddress(address: string) {
    if (!address) {
        return {};
    }
    return getTokens().find(
        (        token: { address: string; }) => token.address.toLowerCase() === address.toLowerCase()
    );
}
//
// function getCustomTokens() {
//     return getTokens().filter(token => token.custom);
// }

export function getTokens() {
    // @ts-ignore
    return config.tokens;
}

export function fromWEI(symbol: string, valueInWEI: any, precision = 4) {
    const token = getTokenBySymbol(symbol);
    if (!token) {
        return 0;
    }
    // @ts-ignore
    const value = fm.toBig(valueInWEI).div("1e" + token.decimals);
    return value.toNumber().toFixed(precision);
}

export function toWEI(symbol: string, value: any) {
    const token = getTokenBySymbol(symbol);
    if (!token) {
        return 0;
    }
    // @ts-ignore
    const valueInBN = fm.toBig(value).times("1e" + token.decimals);
    return valueInBN.toString(10);
}



export default {
    getTokenBySymbol,
    getTokenByAddress,
    getTokens,
    fromWEI,
    toWEI
};
