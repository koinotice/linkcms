import format from "date-fns/format";
const BigNumber = require('bignumber.js');

export function sleep (t: number) {
    new Promise((res, rej) => setTimeout(res, t));
}
export function now() {
    const newdate = new Date();
    const time = format(newdate, 'yyyy-MM-dd HH:mm:ss');
    return time;
}
export function randomNum(maxNum: number, minNum: number, decimalNum: number | undefined) {
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
export function getTokenInfo(balance: any, tokenId: any) {
    for (const tokenInfo of balance) {
      if (tokenInfo.tokenId == tokenId) {
        return tokenInfo;
      }
    }
    return undefined;
  }
export function getAmount(amount: any,dig=1e18) {
    return new BigNumber(amount).div(dig).toString(10);

}

export function getRandom() {
    return Math.random();
}
export default {
    randomNum,
    sleep,
    now,
    getAmount,
    getTokenInfo,
    getRandom,
};
