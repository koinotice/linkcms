package bybit

import (
	. "github.com/koinotice/redox/packages/crex"
	"github.com/koinotice/redox/packages/crex/configtest"
	"testing"
	"time"
)

func testExchange() Exchange {
	testConfig := configtest.LoadTestConfig("bybit")
	params := &Parameters{
		AccessKey: testConfig.AccessKey,
		SecretKey: testConfig.SecretKey,
		Testnet:   testConfig.Testnet,
		ProxyURL:  testConfig.ProxyURL,
		DebugMode: true,
	}
	ex := NewBybit(params)
	return ex
}

func TestBybit_GetBalance(t *testing.T) {
	ex := testExchange()
	balance, err := ex.GetBalance("BTC")
	if err != nil {
		t.Error(err)
		return
	}
	t.Logf("%#v", balance)
}

func TestBybit_GetOpenOrders(t *testing.T) {
	ex := testExchange()
	orders, err := ex.GetOpenOrders("BTCUSD")
	if err != nil {
		t.Error(err)
		return
	}
	for _, v := range orders {
		t.Logf("%#v", v)
	}
}

func TestBybit_GetRecords(t *testing.T) {
	ex := testExchange()
	start := time.Now().Add(-time.Hour)
	records, err := ex.GetRecords("BTCUSD",
		"1", start.Unix(), 0, 10)
	if err != nil {
		t.Error(err)
		return
	}
	for _, v := range records {
		t.Logf("%#v", v)
	}
}

func TestBybit_PlaceOrder(t *testing.T) {
	ex := testExchange()
	// 市价止损单
	order, err := ex.PlaceOrder("BTCUSD",
		Sell, OrderTypeStopMarket, 0, 1,
		OrderBasePriceOption(7135),
		OrderStopPxOption(7090),
		OrderReduceOnlyOption(true),
	)
	if err != nil {
		t.Error(err)
		return
	}
	t.Logf("%#v", order)
}
