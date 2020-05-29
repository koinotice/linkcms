package hbdm

import (
	. "github.com/koinotice/redox/packages/crex"
	"github.com/koinotice/redox/packages/crex/configtest"
	"log"
	"testing"
)

func testWebSocket() *HbdmWebSocket {
	testConfig := configtest.LoadTestConfig("hbdm")

	params := &Parameters{}
	params.AccessKey = testConfig.AccessKey
	params.SecretKey = testConfig.SecretKey
	params.ProxyURL = testConfig.ProxyURL
	params.Testnet = testConfig.Testnet
	params.WsURL = "wss://api.btcgateway.pro/ws"
	ws := NewHbdmWebSocket(params)
	return ws
}

func TestHbdmWebSocket_AllInOne(t *testing.T) {
	ws := testWebSocket()

	ws.SubscribeLevel2Snapshots("BTC", ContractTypeW1, func(ob *OrderBook) {
		log.Printf("ob: %#v", ob)
	})
	ws.SubscribeTrades("BTC", ContractTypeW1, func(trades []Trade) {
		log.Printf("trades: %#v", trades)
	})

	select {}
}

func TestHbdmWebSocket_SubscribeOrders(t *testing.T) {
	ws := testWebSocket()

	ws.SubscribeOrders("BTC", ContractTypeW1, func(orders []Order) {
		log.Printf("orders: %#v", orders)
	})

	select {}
}
