const path = require('path')
if (!process.env.GENV){
    require('dotenv').config(
        {path: path.resolve(process.cwd(), '../.env')}
    );
}

import {Address} from './address';

import delay from 'delay';

const CronJob = require('cron').CronJob;

const env = process.env;

 
import eachLimit from 'async/eachLimit';

import utils from "./utils";


const settings = {
    "LRC": {
        min: 100000,
        max: 200000,
    },
    "ETH": {
        min: 10,
        max: 50,
    },
    "DKEY": {
        min: 1000000,
        max: 20000,
    },


}

// // @ts-ignore
// const wedex = new WedexClient({
//     account: me,
//     logType: LogTypeValue.None,
//     baseUrl: me.url
//
// });

class Bot {
    public market: any
    public ads: Address
    public baseCoin: any

    public constructor() {

    }

    public async getAddress() {

        //const balance = await wedex.Wallet.getWalletBalances().toPromise();
        //
        //
        // const eth = utils.getTokenInfo(balance, 0);
        // const lrc = utils.getTokenInfo(balance, 2);
        // const usdt = utils.getTokenInfo(balance, 3)
        // const dkey = utils.getTokenInfo(balance, 4)
        //
        // console.log("eth:%s,lrc:%s ,usdt:%s,dkey:%s \n",
        //     utils.getAmount(eth.totalAmount.minus(eth.frozenAmount)),
        //     utils.getAmount(lrc.totalAmount.minus(lrc.frozenAmount)),
        //     utils.getAmount(usdt.totalAmount.minus(usdt.frozenAmount), 1e6),
        //     utils.getAmount(dkey.totalAmount.minus(dkey.frozenAmount))
        // )ss(env)


    }

    public async getBalance(account: { account_id: any; access_key: any; }) {

        console.log(account)
        await this.ads.setBalance(account,'0,1,2,3,4,5,6,7,8')

    }

    public async start() {
        this.ads = new Address()
        await this.ads.FetchAddress()
        const data = this.ads.getAddress()

        const that=this;
         
        if(data=="undefined"){
            setTimeout(async ()=>{
                await that.start()},3000)

        }
        else{

            await this.run()
        }

    }

    public async task() {

        //console.log(1)
        const data = await this.ads.getAddress() 
        
        // for (const [i, account] of data.data.address.entries()) {
            
        //     await this.getBalance(account)
        // }
        const that=this
        eachLimit(data.data.address, 1, async function(account:any,callback:any) {
           // console.log("adfasdfa",account)
            await that.getBalance(account)
            callback()
        });
          
    }

    public async run() {
        const that=this;
        
        const job = new CronJob(env.CRON_STRING, function () {
            const d = new Date();
            that.task()
            
        });
        job.start();

    }
}

export {
    Bot
};


