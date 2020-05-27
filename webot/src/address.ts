
const fetch = require('node-fetch');
const {execute} = require('apollo-link');
const {WebSocketLink} = require('apollo-link-ws');
const {SubscriptionClient} = require('subscriptions-transport-ws');
const ws = require('ws');
const ENV = process.env

console.log("-------------")

console.log(ENV.GRAPHQL_WS_URL, ENV.GRAPHQL_ADMIN_PASSWORD)
console.log("-------------")

const BigNumber = require('bignumber.js')

const getWsClient = function (wsurl:any) {

   
    const client = new SubscriptionClient(
        wsurl,
        {
            reconnect: true,
            connectionParams: {
                headers: {
                    "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
                }
            }
        }, ws
    );
    return client;
};

const createSubscriptionObservable = (wsurl:any, query:any, variables:any) => {
    const link = new WebSocketLink(getWsClient(wsurl));
    return execute(link, {query: query, variables: variables});
};

const gql = require('graphql-tag');
function getAmount (amount:any) {
    return new BigNumber(amount).times(1e18).toString(10)
    //new BN(balance).plus(this.totalBalance).toString(10)
  
  }
class Address {

    public env:any;
    public Addresss:any;

    public async init() {
      await  this.FetchAddress()
    }



    public getAddress() {
        return this.Addresss
    }

    public async FetchAddress() {
        const SUBSCRIBE_QUERY = gql`
            subscription getAddress {
                address(
                where: {dex: {_eq: "wedex"}}
                ) {
                    access_key
                    secret_key
                    account_id
                    id
                    dex
                }
            }
        `;

        const subscriptionClient = createSubscriptionObservable(
            ENV.GRAPHQL_WS_URL, // GraphQL endpoint
            SUBSCRIBE_QUERY,                                  // Subscription query
            {}                                      // Query variables
        );
        const that = this;
        var consumer = subscriptionClient.subscribe((eventData: any) => {
            
             
            that.Addresss = eventData


        }, (err:any) => {
            console.log('subscript address error', err);

        });
        console.log(consumer)

    }

    
    /*
    0 0x0000000000000000000000000000000000000000 eth
    3 0xdAC17F958D2ee523a2206206994597C13D831ec7 usdt
    6 0x7aa2467d7e201d2078ef38c6bfd5d0880b23cbde bull
    7 0x4fe21877bb9385237626b19718faa68ebe61d0c8 bear
    */
    async insertBalance(data: { accountId: number; totalAmount: any; amountLocked: any; tokenId: number; }[]) {
        let balance={
            id:0,
            bull:0,
            bear:0,
            usdt:0,
            eth:0,
            bullblock:0,
            bearblock:0,
            usdtblock:0,

        }
        data.forEach((token: { accountId: number; totalAmount: any; amountLocked: any; tokenId: number; })=>{
          
            balance.id=token.accountId
            let amount= (new BigNumber(token.totalAmount).div(1e18).toFixed(2) )
            let block= (new BigNumber(token.amountLocked).div(1e18).toFixed(2) )

            if(token.tokenId==0){ 
                balance.eth=parseFloat(amount)
            }

            if(token.tokenId==6){
                balance.bull=parseFloat(amount)
                balance.bullblock=parseFloat(block)
            }
            if(token.tokenId==7){
                balance.bear=parseFloat(amount)
                balance.bearblock=parseFloat(block)
            }
            if(token.tokenId==3){
                let amount= (new BigNumber(token.totalAmount).div(1e6).toFixed(2) )
                let block= (new BigNumber(token.amountLocked).div(1e6).toFixed(2) )

                balance.usdtblock=parseFloat(block)
                balance.usdt=parseFloat(amount)
            }
             

        })
        //console.log(balance)
        let assert= balance;
       

        let res = await fetch(
            ENV.GRAPHQL_URL,
            {
                method: 'POST',
                headers: {
                    "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
                },
                body: JSON.stringify({
                    query: ` 
                    mutation upsert_article($assets:[assets_insert_input!]!) {
                        
                        insert_assets(objects:$assets, on_conflict: {constraint: assets_pkey, update_columns: [bear, bull,usdt,eth,bearblock,bullblock]}) {
                          returning {
                            id
                          }
                        }
                      }
                  `,
                    variables: { 
                        assets:assert
                    }
                })
            }
        );

       
        // console.log(res)
    }

    async setBalance(accout: { account_id: any; access_key: any; }, tokens: any) {
        //console.log("get balance")
        let response = await fetch(
            `${ENV.WEDEX_API}/api/v2/user/balances?accountId=${accout.account_id}&tokens=${tokens}`,
            {
                method: 'GET',
                headers: {
                    "X-API-KEY": accout.access_key
                }
            }
        )
        let res = await response.json()

        //console.log(res,accout, tokens)
        let data = res.data

        await this.insertBalance(data)


    }


}

export {
    Address
};




