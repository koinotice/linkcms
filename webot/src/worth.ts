
const fetch = require('node-fetch');
const {execute} = require('apollo-link');
const {WebSocketLink} = require('apollo-link-ws');
const {SubscriptionClient} = require('subscriptions-transport-ws');
const ws = require('ws');
const ENV = process.env

var _ = require('lodash');


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
class Worth {

    public env:any;
    public Addresss:any;

     

    public async FetchAddress() {
        

    }

    
    /*
    0 0x0000000000000000000000000000000000000000 eth
    3 0xdAC17F958D2ee523a2206206994597C13D831ec7 usdt
    6 0x7aa2467d7e201d2078ef38c6bfd5d0880b23cbde bull
    7 0x4fe21877bb9385237626b19718faa68ebe61d0c8 bear
    */
    async insert(data) {
        
       

        let res = await fetch(
            ENV.GRAPHQL_URL,
            {
                method: 'POST',
                headers: {
                    "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
                },
                body: JSON.stringify({
                    query: ` 
                    mutation upsert_worth($object:[worth_insert_input!]!) {
                        
                        insert_worth(objects:$object, on_conflict: {constraint: worth_pkey, update_columns: [currprice, lastprice,currworth,lastworth]}) {
                            returning {
                              id
                            }
                        }
                      }
                  `,
                    variables: { 
                        object:data
                    }
                })
            }
        ); 
        
    }

    async GetWorth() {
        
        
         await this.setWorth("3BBULL",1)
         await this.setWorth("3BBEAR",2)



    }

    async setWorth(symbol,id) {
        //console.log("get balance")
        let response = await fetch(
            `https://hd.wedex.io/api/open/leverCoin/worth?symbol=${symbol}`,
            {
                method: 'GET' 
            }
        )
        let res = await response.json()
        
        var data = _.transform(res, function (result, val, key) {
            result[key.toLowerCase()] = val;
        });
        data.id=id
        
         await this.insert(data)


    }


}

export {
    Worth
};




