package okexswap

import (
	"github.com/chuckpreslar/emission"
	. "github.com/koinotice/redox/packages/crex"
	"github.com/koinotice/redox/packages/crex/util"
	"github.com/frankrap/okex-api"
	"time"
)

type SwapWebSocket struct {
	ws      *okex.SwapWS
	emitter *emission.Emitter
}

func (s *SwapWebSocket) SubscribeTrades(market Market, callback func(trades []*Trade)) error {
	s.emitter.On(WSEventTrade, callback)
	s.ws.SubscribeTrade("trade_1", market.Symbol)
	return nil
}

func (s *SwapWebSocket) SubscribeLevel2Snapshots(market Market, callback func(ob *OrderBook)) error {
	s.emitter.On(WSEventL2Snapshot, callback)
	s.ws.SubscribeDepthL2Tbt("depthL2_1", market.Symbol)
	return nil
}

func (s *SwapWebSocket) SubscribeOrders(market Market, callback func(orders []*Order)) error {
	s.emitter.On(WSEventOrder, callback)
	s.ws.SubscribeOrder("order_1", market.Symbol)
	return nil
}

func (s *SwapWebSocket) SubscribePositions(market Market, callback func(positions []*Position)) error {
	s.emitter.On(WSEventPosition, callback)
	s.ws.SubscribePosition("position_1", market.Symbol)
	return nil
}

func (s *SwapWebSocket) depth20SnapshotCallback(obRaw *okex.OrderBook) {
	// log.Printf("depthCallback %#v", *depth)
	// ch: market.BTC_CQ.depth.step0
	ob := &OrderBook{
		Symbol: obRaw.InstrumentID,
		Time:   time.Now(),
		Asks:   nil,
		Bids:   nil,
	}
	for _, v := range obRaw.Asks {
		ob.Asks = append(ob.Asks, Item{
			Price:  v.Price,
			Amount: v.Amount,
		})
	}
	for _, v := range obRaw.Bids {
		ob.Bids = append(ob.Bids, Item{
			Price:  v.Price,
			Amount: v.Amount,
		})
	}
	s.emitter.Emit(WSEventL2Snapshot, ob)
}

func (s *SwapWebSocket) tradeCallback(_trades []okex.WSTrade) {
	// log.Printf("tradeCallback")
	var result []*Trade
	for _, v := range _trades {
		var direction Direction
		if v.Side == "buy" {
			direction = Buy
		} else if v.Side == "sell" {
			direction = Sell
		}
		t := Trade{
			ID:        v.TradeID,
			Direction: direction,
			Price:     util.ParseFloat64(v.Price),
			Amount:    util.ParseFloat64(v.Side),
			Ts:        v.Timestamp.UnixNano() / int64(time.Millisecond),
			Symbol:    v.InstrumentID,
		}
		result = append(result, &t)
	}
	s.emitter.Emit(WSEventTrade, result)
}

func (s *SwapWebSocket) ordersCallback(orders []okex.WSOrder) {
	//log.Printf("ordersCallback")
	var eventData []*Order
	for _, v := range orders {
		o := s.convertOrder(&v)
		eventData = append(eventData, o)
	}
	s.emitter.Emit(WSEventOrder, eventData)
}

func (s *SwapWebSocket) convertOrder(order *okex.WSOrder) *Order {
	o := &Order{}
	o.ID = order.OrderID
	o.Symbol = order.InstrumentID
	o.Price = util.ParseFloat64(order.Price)
	o.AvgPrice = util.ParseFloat64(order.PriceAvg)
	// o.StopPx = 0
	o.Amount = util.ParseFloat64(order.Size)
	o.FilledAmount = util.ParseFloat64(order.FilledQty)
	switch order.Type {
	case "1":
		o.Direction = Buy
	case "2":
		o.Direction = Sell
	case "3":
		o.Direction = Sell
		o.ReduceOnly = true
	case "4":
		o.Direction = Buy
		o.ReduceOnly = true
	}
	/*
		0：普通委托
		1：只做Maker（Post only）
		2：全部成交或立即取消（FOK）
		3：立即成交并取消剩余（IOC）
		4：市价委托
	*/
	switch order.OrderType {
	case "0":
		o.Type = OrderTypeLimit
	case "1":
		o.Type = OrderTypeMarket
		o.PostOnly = true
	case "2":
		o.Type = OrderTypeLimit
	case "3":
		o.Type = OrderTypeLimit
	case "4":
		o.Type = OrderTypeMarket
	default:
		o.Type = OrderTypeLimit
	}
	/*
		-2:失败
		-1:撤单成功
		0:等待成交
		1:部分成交
		2:完全成交
		3:下单中
		4:撤单中
	*/
	switch order.State {
	case "-2":
		o.Status = OrderStatusRejected
	case "-1":
		o.Status = OrderStatusCancelled
	case "0":
		o.Status = OrderStatusNew
	case "1":
		o.Status = OrderStatusPartiallyFilled
	case "2":
		o.Status = OrderStatusFilled
	case "3":
		o.Status = OrderStatusCreated
	case "4":
		o.Status = OrderStatusCancelPending
	}
	return o
}

func (s *SwapWebSocket) positionsCallback(positions []okex.WSSwapPositionData) {
	//log.Printf("positionsCallback")
	var eventData []*Position
	for _, v := range positions {
		for _, v1 := range v.Holding {
			var o Position
			o.Symbol = v.InstrumentID
			o.OpenTime = v1.Timestamp
			if v1.Side == "long" {
				o.Size = util.ParseFloat64(v1.Position)
			} else if v1.Side == "short" {
				o.Size = -util.ParseFloat64(v1.Position)
			}
			o.OpenPrice = util.ParseFloat64(v1.AvgCost)
			o.AvgPrice = o.OpenPrice
			eventData = append(eventData, &o)
		}
	}
	s.emitter.Emit(WSEventPosition, eventData)
}

func NewSwapWebSocket(params *Parameters) *SwapWebSocket {
	wsURL := "wss://real.okex.com:8443/ws/v3"
	s := &SwapWebSocket{
		emitter: emission.NewEmitter(),
	}
	ws := okex.NewSwapWS(wsURL,
		params.AccessKey, params.SecretKey, params.Passphrase, params.DebugMode)
	if params.ProxyURL != "" {
		ws.SetProxy(params.ProxyURL)
	}
	ws.SetDepth20SnapshotCallback(s.depth20SnapshotCallback)
	ws.SetTradeCallback(s.tradeCallback)
	ws.SetOrderCallback(s.ordersCallback)
	ws.SetPositionCallback(s.positionsCallback)
	ws.Start()
	s.ws = ws
	return s
}
