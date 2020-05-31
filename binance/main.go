package main

import (
	//"database/sql"
	//"encoding/json"
	"fmt"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/koinotice/redox/packages/goex"
	"github.com/koinotice/redox/packages/goex/binance"
	"github.com/koinotice/redox/wedex/model"
	"net"
	//"fmt"

	"net/http"
	"time"
)

var bs = binance.NewBinanceSwap(&goex.APIConfig{
	//Endpoint: "https://testnet.binancefuture.com",
	HttpClient: &http.Client{
		Transport: &http.Transport{
			//Proxy: func(req *http.Request) (*url.URL, error) {
			//	return url.Parse("socks5://127.0.0.1:15235")
			//	return nil, nil
			//},
			Dial: (&net.Dialer{
				Timeout: 10 * time.Second,
			}).Dial,
		},
		Timeout: 10 * time.Second,
	},
	ApiKey:       "mjwZ5e1k4lJb2tOynAUZzUfht71f6kMke3hNF9tplSk1NPHjlb4nSKdooDtPqfT2",
	ApiSecretKey: "uBnmT7EQS6UGug1uUHcrCqLZGNHXv9x5OF383uw48xp16ffYDLmmu5LNRLyxSYpX",
})

func main() {
	model.Connect("host=etf.wedex.io port=5434 user=postgres dbname=postgres password=Zheli123 sslmode=disable")

	//go getOpenOrder()

	ticker := time.NewTicker(3 * time.Second)
	for {
		select {


		case <-ticker.C:
			go getOpenOrder()
			go getAccount()

		}
	}

	//
	//select {}
}
func getOpenOrder() {
	fmt.Println("start get open orders")
	orders, err := bs.GetFuturePosition(goex.BTC_USDT, "")
	//fmt.Printf("start get open orders",orders)
	if err != nil {
		fmt.Println(err)
	} else {
		for _, order := range orders {
			m := model.Contract{
				ForceLiquPrice: order.ForceLiquPrice,
				LeverRate:      order.LeverRate,
			}
			if order.BuyAmount > 0 {
				m.Amount = order.BuyAmount
				m.ProfitReal = order.BuyProfitReal
				m.PriceAvg = order.BuyPriceAvg
				m.Direct = "多单"
				m.Exchange = "Binana-BTC/USDT-多单"

			} else {
				m.Amount = order.SellAmount
				m.ProfitReal = order.SellProfitReal
				m.PriceAvg = order.SellPriceAvg
				m.Direct = "空单"
				m.Exchange = "Binana-BTC/USDT-空单"
			}
			m.Upsert(&m)
			fmt.Printf("%+v\n", order)
		}

	}
}

func getAccount() {
	fmt.Println("get account balance")
	Userinfo, err := bs.GetFutureUserinfo()
	if err != nil {
		fmt.Println(err)
	}else{
		for _, balance := range Userinfo.FutureSubAccounts {
			//m:=model.Exchange.FindById(3)

			m := model.Exchange{
			Exchange:      "binanace-" + balance.Currency.Symbol,
			Contract:      "永续",
			AccountRights: balance.AccountRights,
			Keep:          balance.KeepDeposit,
			ProfitUnreal:  balance.ProfitUnreal,
			RiskRate:      balance.RiskRate,
		}
			m.Upsert(&m)

		}
	}

}
