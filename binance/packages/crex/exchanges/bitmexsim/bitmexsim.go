package bitmexsim

import (
	"errors"
	"fmt"
	. "github.com/koinotice/redox/packages/crex"
	"github.com/koinotice/redox/packages/crex/dataloader"
	"github.com/koinotice/redox/packages/crex/util"
	"log"
	"math"
	"time"
)

const (
	OrderSizeLimit = 10000000 // Order size limit
)

type MarginInfo struct {
	Leverage              float64
	MaintMargin           float64
	LiquidationPriceLong  float64
	LiquidationPriceShort float64
}

// BitMEXSim the BitMEX exchange for backtest
type BitMEXSim struct {
	data          *dataloader.Data
	makerFeeRate  float64 // -0.00025	// Maker fee rate
	takerFeeRate  float64 // 0.00075	// Taker fee rate
	balance       float64
	orders        map[string]*Order    // All orders key: OrderID value: Order
	openOrders    map[string]*Order    // Open orders
	historyOrders map[string]*Order    // History orders
	positions     map[string]*Position // Position key: symbol

	symbol string
}

func (b *BitMEXSim) GetName() (name string) {
	return "bitmex"
}

func (b *BitMEXSim) GetTime() (tm int64, err error) {
	err = ErrNotImplemented
	return
}

func (b *BitMEXSim) GetBalance(symbol string) (result *Balance, err error) {
	result = &Balance{}
	result.Available = b.balance
	position := b.getPosition(symbol)
	var price float64
	ob := b.data.GetOrderBook()
	side := position.Side()
	if side == Buy {
		price = ob.AskPrice()
	} else if side == Sell {
		price = ob.BidPrice()
	}
	pnl, _ := CalcPnl(side, math.Abs(position.Size), position.AvgPrice, price)
	result.Equity = result.Available + pnl
	return
}

func (b *BitMEXSim) GetOrderBook(symbol string, depth int) (result *OrderBook, err error) {
	result = b.data.GetOrderBook()
	return
}

func (b *BitMEXSim) GetRecords(symbol string, period string, from int64, end int64, limit int) (records []*Record, err error) {
	return
}

func (b *BitMEXSim) SetContractType(currencyPair string, contractType string) (err error) {
	b.symbol = currencyPair
	return
}

func (b *BitMEXSim) GetContractID() (symbol string, err error) {
	return b.symbol, nil
}

func (b *BitMEXSim) SetLeverRate(value float64) (err error) {
	return
}

func (b *BitMEXSim) OpenLong(symbol string, orderType OrderType, price float64, size float64) (result *Order, err error) {
	return b.PlaceOrder(symbol, Buy, orderType, price, size)
}

func (b *BitMEXSim) OpenShort(symbol string, orderType OrderType, price float64, size float64) (result *Order, err error) {
	return b.PlaceOrder(symbol, Sell, orderType, price, size)
}

func (b *BitMEXSim) CloseLong(symbol string, orderType OrderType, price float64, size float64) (result *Order, err error) {
	return b.PlaceOrder(symbol, Sell, orderType, price, size, OrderReduceOnlyOption(true))
}

func (b *BitMEXSim) CloseShort(symbol string, orderType OrderType, price float64, size float64) (result *Order, err error) {
	return b.PlaceOrder(symbol, Buy, orderType, price, size, OrderReduceOnlyOption(true))
}

func (b *BitMEXSim) PlaceOrder(symbol string, direction Direction, orderType OrderType, price float64,
	size float64, opts ...PlaceOrderOption) (result *Order, err error) {
	params := ParsePlaceOrderParameter(opts...)
	_id, _ := util.NextID()
	id := fmt.Sprintf("%v", _id)
	order := &Order{
		ID:           id,
		Symbol:       symbol,
		Price:        price,
		Amount:       size,
		AvgPrice:     0,
		FilledAmount: 0,
		Direction:    direction,
		Type:         orderType,
		PostOnly:     params.PostOnly,
		ReduceOnly:   params.ReduceOnly,
		Status:       OrderStatusNew,
	}

	err = b.matchOrder(order, true)
	if err != nil {
		return
	}

	if order.IsOpen() {
		b.openOrders[id] = order
	} else {
		b.historyOrders[id] = order
	}

	b.orders[id] = order
	result = order
	return
}

// 撮合成交
func (b *BitMEXSim) matchOrder(order *Order, immediate bool) (err error) {
	switch order.Type {
	case OrderTypeMarket:
		err = b.matchMarketOrder(order)
	case OrderTypeLimit:
		err = b.matchLimitOrder(order, immediate)
	}
	return
}

func (b *BitMEXSim) matchMarketOrder(order *Order) (err error) {
	if !order.IsOpen() {
		return
	}

	// 检查委托:
	// Rejected, maximum size of order is $1,000,000
	// 委托量不能大于 1000000

	//最大委托价格	1,000,000
	//最大委托数量	10,000,000
	//最小合约数量	1

	if order.Amount > OrderSizeLimit {
		err = errors.New("Rejected, maximum size of order is 1,000,000")
		return
	}

	ob := b.data.GetOrderBook()

	// 判断开仓数量
	margin := b.balance
	// sizeCurrency := order.Amount / price(ask/bid)
	// leverage := sizeCurrency / margin
	// 需要满足: sizeCurrency <= margin * 100
	// 可开仓数量: <= margin * 100 * price(ask/bid)
	var maxSize float64

	// 市价成交
	if order.Direction == Buy {
		maxSize = margin * 100 * ob.AskPrice()
		if order.Amount > maxSize {
			err = errors.New(fmt.Sprintf("Rejected, maximum size of future position is %v", maxSize))
			return
		}

		price := ob.AskPrice()
		size := order.Amount

		// trade fee
		fee := size / price * b.takerFeeRate

		// Update balance
		b.addBalance(-fee)

		// Update position
		b.updatePosition(order.Symbol, size, price)

		order.AvgPrice = price
	} else if order.Direction == Sell {
		maxSize = margin * 100 * ob.BidPrice()
		if order.Amount > maxSize {
			err = errors.New(fmt.Sprintf("Rejected, maximum size of future position is %v", maxSize))
			return
		}

		price := ob.BidPrice()
		size := order.Amount

		// trade fee
		fee := size / price * b.takerFeeRate

		// Update balance
		b.addBalance(-fee)

		// Update position
		b.updatePosition(order.Symbol, -size, price)

		order.AvgPrice = price
	}
	order.FilledAmount = order.Amount
	order.Status = OrderStatusFilled
	return
}

func (b *BitMEXSim) matchLimitOrder(order *Order, immediate bool) (err error) {
	if !order.IsOpen() {
		return
	}

	ob := b.data.GetOrderBook()
	if order.Direction == Buy { // Bid order
		if order.Price < ob.AskPrice() {
			return
		}

		if immediate && order.PostOnly {
			order.Status = OrderStatusRejected
			return
		}

		// match trade
		size := order.Amount
		var fee float64

		// trade fee
		if immediate {
			fee = size / order.Price * b.takerFeeRate
		} else {
			fee = size / order.Price * b.makerFeeRate
		}

		// Update balance
		b.addBalance(-fee)

		// Update position
		b.updatePosition(order.Symbol, size, order.Price)

		order.AvgPrice = order.Price
		order.FilledAmount = order.Amount
		order.Status = OrderStatusFilled
	} else { // Ask order
		if order.Price > ob.BidPrice() {
			return
		}

		if immediate && order.PostOnly {
			order.Status = OrderStatusRejected
			return
		}

		// match trade
		size := order.Amount
		var fee float64

		// trade fee
		if immediate {
			fee = size / order.Price * b.takerFeeRate
		} else {
			fee = size / order.Price * b.makerFeeRate
		}

		// Update balance
		b.addBalance(-fee)

		// Update position
		b.updatePosition(order.Symbol, -size, order.Price)

		order.AvgPrice = order.Price
		order.FilledAmount = order.Amount
		order.Status = OrderStatusFilled
	}
	return
}

// 更新持仓
func (b *BitMEXSim) updatePosition(symbol string, size float64, price float64) {
	position := b.getPosition(symbol)
	if position == nil {
		log.Fatalf("position error symbol=%v", symbol)
	}

	if position.Size > 0 && size < 0 || position.Size < 0 && size > 0 {
		b.closePosition(position, size, price)
	} else {
		b.addPosition(position, size, price)
	}
}

// 增加持仓
func (b *BitMEXSim) addPosition(position *Position, size float64, price float64) (err error) {
	if position.Size < 0 && size > 0 || position.Size > 0 && size < 0 {
		err = errors.New("方向错误")
		return
	}
	// 平均成交价
	// total_quantity / ((quantity_1 / price_1) + (quantity_2 / price_2)) = entry_price
	// 增加持仓
	var positionCost float64
	if position.Size != 0 && position.AvgPrice != 0 {
		positionCost = math.Abs(position.Size) / position.AvgPrice
	}

	newPositionCost := math.Abs(size) / price
	totalCost := positionCost + newPositionCost

	totalSize := math.Abs(position.Size + size)
	avgPrice := totalSize / totalCost

	position.AvgPrice = avgPrice
	position.Size += size
	return
}

// 平仓，超过数量，则开立新仓
func (b *BitMEXSim) closePosition(position *Position, size float64, price float64) (err error) {
	if position.Size == 0 {
		err = errors.New("当前无持仓")
		return
	}
	if position.Size > 0 && size > 0 || position.Size < 0 && size < 0 {
		err = errors.New("方向错误")
		return
	}
	remaining := math.Abs(size) - math.Abs(position.Size)
	if remaining > 0 {
		// 先平掉原有持仓
		// 计算盈利
		pnl, _ := CalcPnl(position.Side(), math.Abs(position.Size), position.AvgPrice, price)
		b.addPnl(pnl)
		position.AvgPrice = price
		position.Size = position.Size + size
	} else if remaining == 0 {
		// 完全平仓
		pnl, _ := CalcPnl(position.Side(), math.Abs(size), position.AvgPrice, price)
		b.addPnl(pnl)
		position.AvgPrice = 0
		position.Size = 0
	} else {
		// 部分平仓
		pnl, _ := CalcPnl(position.Side(), math.Abs(position.Size), position.AvgPrice, price)
		b.addPnl(pnl)
		//position.AvgPrice = position.AvgPrice
		position.Size = position.Size + size
	}
	return
}

// 增加Balance
func (b *BitMEXSim) addBalance(value float64) {
	b.balance += value
}

// 增加P/L
func (b *BitMEXSim) addPnl(pnl float64) {
	b.balance += pnl
}

// 获取持仓
func (b *BitMEXSim) getPosition(symbol string) *Position {
	if position, ok := b.positions[symbol]; ok {
		return position
	} else {
		position = &Position{
			Symbol:    symbol,
			OpenTime:  time.Time{},
			OpenPrice: 0,
			Size:      0,
			AvgPrice:  0,
		}
		b.positions[symbol] = position
		return position
	}
}

func (b *BitMEXSim) GetOpenOrders(symbol string, opts ...OrderOption) (result []*Order, err error) {
	for _, v := range b.openOrders {
		if v.Symbol == symbol {
			result = append(result, v)
		}
	}
	return
}

func (b *BitMEXSim) GetOrder(symbol string, id string, opts ...OrderOption) (result *Order, err error) {
	order, ok := b.orders[id]
	if !ok {
		err = errors.New("not found")
		return
	}
	result = order
	return
}

func (b *BitMEXSim) CancelOrder(symbol string, id string, opts ...OrderOption) (result *Order, err error) {
	if order, ok := b.orders[id]; ok {
		if !order.IsOpen() {
			err = errors.New("status error")
			return
		}
		switch order.Status {
		case OrderStatusCreated, OrderStatusNew, OrderStatusPartiallyFilled:
			order.Status = OrderStatusCancelled
			result = order
			delete(b.openOrders, id)
		default:
			err = errors.New("error")
		}
	} else {
		err = errors.New("not found")
	}
	return
}

func (b *BitMEXSim) CancelAllOrders(symbol string, opts ...OrderOption) (err error) {
	var idsToBeRemoved []string

	for _, order := range b.openOrders {
		if !order.IsOpen() {
			log.Printf("Order error: %#v", order)
			continue
		}
		switch order.Status {
		case OrderStatusCreated, OrderStatusNew, OrderStatusPartiallyFilled:
			order.Status = OrderStatusCancelled
			idsToBeRemoved = append(idsToBeRemoved, order.ID)
		default:
			err = errors.New("error")
		}
	}

	for _, id := range idsToBeRemoved {
		delete(b.openOrders, id)
	}
	return
}

func (b *BitMEXSim) AmendOrder(symbol string, id string, price float64, size float64, opts ...OrderOption) (result *Order, err error) {
	return
}

func (b *BitMEXSim) GetPositions(symbol string) (result []*Position, err error) {
	position, ok := b.positions[symbol]
	if !ok {
		err = errors.New("not found")
		return
	}
	result = []*Position{position}
	return
}

func (b *BitMEXSim) SubscribeTrades(market Market, callback func(trades []*Trade)) error {
	return nil
}

func (b *BitMEXSim) SubscribeLevel2Snapshots(market Market, callback func(ob *OrderBook)) error {
	return nil
}

func (b *BitMEXSim) SubscribeOrders(market Market, callback func(orders []*Order)) error {
	return nil
}

func (b *BitMEXSim) SubscribePositions(market Market, callback func(positions []*Position)) error {
	return nil
}

func (b *BitMEXSim) SetExchangeLogger(l ExchangeLogger) {

}

func (b *BitMEXSim) RunEventLoopOnce() (err error) {
	for _, order := range b.openOrders {
		b.matchOrder(order, false)
	}
	return
}

func NewBitMEXSim(data *dataloader.Data, cash float64, makerFeeRate float64, takerFeeRate float64) *BitMEXSim {
	return &BitMEXSim{
		data:          data,
		balance:       cash,
		makerFeeRate:  makerFeeRate, // -0.00025 // Maker 费率
		takerFeeRate:  takerFeeRate, // 0.00075	// Taker 费率
		orders:        make(map[string]*Order),
		openOrders:    make(map[string]*Order),
		historyOrders: make(map[string]*Order),
		positions:     make(map[string]*Position),
	}
}
