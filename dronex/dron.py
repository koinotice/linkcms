 

from dragonex import DragonExV1

ACCESS_KEY = '7a01abce4b7a5f0e8f557c05e405ca2a'
SECRET_KEY = 'cfe884b5ddf351eb9a5757021624d1ee'
 

HOST = 'https://openapi.dragonex.im'

 

import random
import numpy as np
import time


market = 'ones_usdt'
symbol_id=325
PRECISION = 1e-11
tickSize = 0.00001
volumeSize = 1

tickSizeNumber = 4

volumeSizeNumber = 0

tradeVolume = 1000
tradeVolumeMin = 100
tradeVolumeMax = 500
SELL = 'sell'
BUY = 'buy'
randomNumber = 35
count_to_cancel = 0

current_orders = []
all_the_pending_orders = []

#获取所有未完全成交的订单
def get_pending_orders():
    orders= client.get_all_unfinished_order(state="1")
  

    orders_no=[]
    for n in orders['data']:
        orders_no.append(n["user_order_id"])

    
    return orders_no



def cancel_a_order(client, market, a_pending_order):
    timeSpace = get_a_random_number_between(1, 1.1, precise=1e-11)
    timeSpace = round(timeSpace, 1)
    #time.sleep(timeSpace)
    try:
        result=client.cancel_order(pair=market,user_order_id=a_pending_order)
        print(result)
        if result["code"]==200:
            current_orders.remove(a_pending_order)
        #client.cancel_the_order(market, a_pending_order)
        print("cancel a order: ", a_pending_order)
    except Exception as e:
        print("can't cancel order: ", a_pending_order)
        print(e)


def print_current_time():
    print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))


def current_minute():
    temp = time.strftime("%M", time.localtime())
    temp = int(temp) % 10
    return_val = 0
    if temp < 5:
        return_val = 0
    else:
        return_val = 1
    return return_val


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


def get_some_number_between(a, b, precise=tickSize):
    priceList = []
    for i in range(randomNumber):
        temp = get_a_random_number_between(a, b, precise)
        priceList.append(temp)

    tempRandom = random.uniform(0, 1)

    if tempRandom < 0.5:
        priceList.sort(reverse=False)
    else:
        priceList.sort(reverse=True)

    # tempRandom = random.uniform(0, 1)
    # if tempRandom < 0.5:
    #     temp = priceList[0]
    #     priceList[0] = priceList[1]
    #     priceList[1] = temp
    #
    # tempRandom = random.uniform(0, 1)
    # if tempRandom < 0.5:
    #     temp = priceList[-1]
    #     priceList[-1] = priceList[-2]
    #     priceList[-2] = temp
    random.shuffle(priceList)
    return priceList


def market_depth():
        '''Get the depth ofLBank,1 <= size <= 60, merge: 0 or 1'''
       
        try:
              
            res=client.get_quotation_depth(symbol_id=symbol_id)
            if res.code==1:
                data=res.data
                return data['buys'][0]['price'],data['sells'][0]['price']
                # buys = [(float(row[0]), float(row[1])) for row in data['buys']]
                # print(buys)
                #return [data.buys[0].price,data.sells[0].price]
            else:
                return ([0.0, 0.0])
            # asks = [(float(row[0]), float(row[1])) for row in data["data"]['asks']]
            # bids = [(float(row[0]), float(row[1])) for row in data["data"]['bids']]
            # result = {'asks': asks, 'bids': bids}
            # if len(result['asks']) == 0 or len(result['bids']) == 0:
            #     return ([0.0, 0.0])
            # else:
            #     return ([result['bids'][0][0], result['asks'][0][0]])
        except Exception as e:
            print(e)
            print("depth error")
            return ([0.0, 0.0])

minuteLocate = 0
priceList = []
currentNumber = 0
initialized = False


client = DragonExV1(access_key=ACCESS_KEY, secret_key=SECRET_KEY, host=HOST)
client.ensure_token_enable(False)



while (True):
    timeSpace = get_a_random_number_between(40, 70, precise=1e-8)
    #print("timeSpace: ", timeSpace)
    timeSpace = round(timeSpace, 1)
    print("timeSpace: ", timeSpace)
   # time.sleep(timeSpace)
    bid_price = 0.0
    ask_price = 0.0
    result = market_depth()

    bid_price = float(result[0])
    bid_price = round(bid_price, tickSizeNumber)
    ask_price = float(result[1])
    ask_price = round(ask_price, tickSizeNumber)
    
    print("bid_price and ask_price: ", bid_price, ask_price)
   

    target_price = get_a_random_number_between(bid_price, ask_price, tickSize)

    # target_price = get_a_random_number_between(bid_price, ask_price, tickSize)
    print("pre caculate price: ", target_price)
    if target_price < PRECISION:
        print("err1")
        continue
    elif target_price >= ask_price or target_price <= bid_price:
        print("err2")
        continue


    target_price = round(target_price, tickSizeNumber)
    tradeVolume = get_a_random_number_between(tradeVolumeMin, tradeVolumeMax, precise=volumeSize)
    tradeVolume = round(tradeVolume, volumeSizeNumber)

    print("target_price and tradeVolume: ", target_price, tradeVolume)

    # if random.random() > 0.5:
    #     first = SELL
    #     second = BUY
    # else:
    #     first = BUY
    #     second = SELL

    # try:
        
    #     result=client.place_order_sell(symbol_id=symbol_id, price=target_price, volume=tradeVolume,side=first)
        
    # except Exception as e:
    #     print("can't send the order limit!")
    #     print(e)
    #     continue
     
    # if  result.data:
    #     current_orders.append(result.data["order_id"]) 
   
    # try:
    #     result=client.place_order_sell(symbol_id=symbol_id, price=target_price, volume=tradeVolume,side=second)

    # except Exception as e:
    #     print("can't send the order limit!")
    #     print(e)
    #     continue 
    # if  result.data:
    #     current_orders.append(result.data["order_id"]) 
   
    
    # # # if 'data' in result:
    # # #     current_orders.append(result["data"])
    # print("order success")
    # print_current_time()
    # time.sleep(5)
 
    # try:
 
          
    #         for a_pending_order in current_orders:
    #             res=client.cancel_order(symbol_id, a_pending_order)
    #             current_orders.remove(a_pending_order)
    #             print("Cancel the order:", res)
    #         #current_orders.clear()
    # except Exception as e:
    #         print("can't cancel the orders!")
    #         print(e)
