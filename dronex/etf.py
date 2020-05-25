# -*- coding: utf-8 -*-
import random
from sgqlc.endpoint.http import HTTPEndpoint
import os
import time
from dragonex import DragonExV1
from dotenv import load_dotenv

from pathlib import Path  # python3 only


env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)
 
url = os.getenv("GRAPHQL_URL")
headers = {'x-hasura-admin-secret': os.getenv("GRAPHQL_ADMIN_PASSWORD")}
 
query = '''query getAddress {
  address(
   where: {dex: {_eq: "dron"}}
  ) {
    access_key
    secret_key
    account_id
    id
    dex
  }
}'''

insertbalance='''
 mutation upsert_article($object: [balances_insert_input!]!,$assets:[assets_insert_input!]!) {
                        insert_balances(objects: $object) {
                          returning {
                            id
                          }
                        }
                        insert_assets(objects:$assets, on_conflict: {constraint: assets_pkey, update_columns: [bear, bull,usdt,eth,bearblock,bullblock]}) {
                          returning {
                            id
                          }
                        }
                      }
'''
variables = {}

endpoint = HTTPEndpoint(url, headers)
Address = endpoint(query, variables)

 
tickSize = 0.00001
PRECISION = 1e-11

HOST = 'https://openapi.dragonex.im'


def update_balance(data,accountId):
    bb={
            "accountId":accountId,
            "bull":0,
            "bear":0,
            "usdt":0,
            "eth":0,
            "bullblock":0,
            "bearblock":0,
            "usdtblock":0,
    }   
    for index, balance in enumerate(data):
        #print(balance)
        if balance['coin_id']==1:
            bb["usdt"]=float(balance["volume"])
            bb["usdtblock"]=float(balance["frozen"])

          
        if balance['coin_id']==103:
            bb["eth"]=float(balance["volume"])
            bb["ethblock"]=float(balance["frozen"])

            

        if balance['coin_id']==327:
            bb["bull"]=float(balance["volume"])
            bb["bearblock"]=float(balance["frozen"])
        
        if balance['coin_id']==328:
            bb["bear"]=float(balance["volume"])
            bb["bullblock"]=float(balance["frozen"])

    assert1={"id":accountId}
    assert1.update(bb)
    variables = {}
    variables['assets']=assert1
    variables['object']=bb
    print(bb)
          

    updateBalance = endpoint(insertbalance, variables)
    print(updateBalance)  


def get_a_random_number_between(a, b, precise=tickSize):

    # precise=1e-8
    # tickSize=0.1
    # PRECISION = 1e-11

    if abs(precise - tickSize) < PRECISION and abs(b - a) / tickSize > 200:
        a = max(a, b)
        b = a - 200 * tickSize

    if abs(a - b) < precise + PRECISION:
        return 0.0
    result = min(a, b) + (random.uniform(0, 1) * abs(a - b))
    result = int(result / precise) * precise
    if (result - min(a, b)) < PRECISION:
        result = min(a, b) + precise
    if (max(a, b) - result) < PRECISION:
        result = max(a, b) - precise
    return result

#{'coin_id': 327, 'code': '3bbull'}, {'coin_id': 328, 'code': '3bbear'}
while (True):
    timeSpace = get_a_random_number_between(5, 10, precise=1e-8)
    #print("timeSpace: ", timeSpace)
    timeSpace = round(timeSpace, 1)
    time.sleep(timeSpace)
    #print("timeSpace: ", timeSpace)

    addresss=Address['data']['address']
    for index, account in enumerate(addresss):
       
    
        dragonex = DragonExV1(access_key=account['access_key'], secret_key=account['secret_key'], host=HOST)
        #dragonex.ensure_token_enable(False)

        
        r = dragonex.get_user_own_coins()

        #print(r.data)
        update_balance(r.data, account["account_id"])
