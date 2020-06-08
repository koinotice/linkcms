const path = require('path')
if (!process.env.GENV){
    require('dotenv').config(
        {path: path.resolve(process.cwd(), '../.env')}
    );
}

import {Address} from './address';
import {Worth} from './worth';
import {Dkey} from './dkey';

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
    public worth:any
    public dkey:any

    public constructor() {

    }

     

    public async getBalance(account: { account_id: any; access_key: any; }) {

       
        await this.ads.setBalance(account,'0,1,2,3,4,5,6,7,8')

    }

    public async start() {
        this.ads = new Address()
        await this.ads.FetchAddress()
        const data = this.ads.getAddress()
        this.worth=new Worth   
        
        this.dkey=new Dkey
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

        await this.worth.GetWorth()
        const data = await this.ads.getAddress()   
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

        const job1 = new CronJob("0 8 * * * *", function () {
            const d = new Date();
            that.dkey.GetData()
            
        });
        job1.start();

    }
}

export {
    Bot
};


