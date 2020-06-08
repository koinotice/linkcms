
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
class Dkey {

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
                    mutation insert_dkey($object: dkey_insert_input! ) {
                        insert_dkey_one(object: $object) {
                          id
                          
                        }
                      }
                  `,
                    variables: { 
                        object:data
                    }
                })
            }
        );

       
        console.log(JSON.stringify({ 
                        object:data
                    }))
    }

    async GetData() {
        let response = await fetch(
            ENV.GRAPHQL_URL,
            {
                method: 'POST',
                headers: {
                    "x-hasura-admin-secret": ENV.GRAPHQL_ADMIN_PASSWORD
                },
                body: JSON.stringify({
                    query: ` 
                    query MyQuery {
                        worth {
                          lastworth
                          id
                        }
                        assets_aggregate(where: {id: {_gt: 2}}) {
                           
                          aggregate {
                            sum {
                              bear
                               bull
                            }
                            
                          }
                        }
                        address_aggregate(where: {dex: {_eq: "wedex"}}) {
                          aggregate {
                            sum {
                              bear
                              bull
                            }
                          }
                        }
                      }
                      
                  `,
                    
                })
            }
        );

        let res = await response.json()
        console.log(res.data.worth)
        console.log(res.data.assets_aggregate)
        let data=res.data
        let dkey={
            bull:0,
            bear:0,
            bullnum:0,
            bearnum:0
        }
        data.worth.forEach(obj => {
            if(obj.id==1){
                dkey.bull=obj.lastworth
            }
            if(obj.id==2){
                dkey.bear=obj.lastworth
            } 
        });
        console.log(data.address_aggregate.aggregate.sum)
        dkey.bullnum=data.address_aggregate.aggregate.sum.bull-data.assets_aggregate.aggregate.sum.bull


        dkey.bearnum=data.address_aggregate.aggregate.sum.bear-data.assets_aggregate.aggregate.sum.bear

        console.log(dkey)
        this.insert(dkey)
         


    }

    


}

export {
    Dkey
};




