package crex

import "time"

type Balance struct {
	Equity        float64 // 净值
	Available     float64 // 可用余额
	RealizedPnl   float64
	UnrealisedPnl float64
}

type Item struct {
	Price  float64
	Amount float64
}

type OrderBook struct {
	Symbol string
	Time   time.Time
	Asks   []Item
	Bids   []Item
}

// Ask 卖一
func (o *OrderBook) Ask() (result Item) {
	if len(o.Asks) > 0 {
		result = o.Asks[0]
	}
	return
}

// Bid 买一
func (o *OrderBook) Bid() (result Item) {
	if len(o.Bids) > 0 {
		result = o.Bids[0]
	}
	return
}

// AskPrice 卖一价
func (o *OrderBook) AskPrice() (result float64) {
	if len(o.Asks) > 0 {
		result = o.Asks[0].Price
	}
	return
}

func avePrice(items []Item, size float64) float64 {
	var totalSize = 0.0
	var totalValue = 0.0

	var lSize = size
	var n = len(items)

	for i := 0; i < n; i++ {
		if lSize >= items[i].Amount {
			totalSize += items[i].Amount
			totalValue += items[i].Amount * items[i].Price
			lSize -= items[i].Amount
		} else {
			// size := lSize
			totalSize += lSize
			totalValue += lSize * items[i].Price
			lSize = 0
		}
		if lSize <= 0 {
			break
		}
	}

	if lSize != 0 || totalSize == 0 {
		return -1
	}
	return totalValue / totalSize

}
func (o *OrderBook) AskAvePrice(size float64) float64 {
	return avePrice(o.Asks, size)
}

func (o *OrderBook) BidAvePrice(size float64) float64 {
	return avePrice(o.Bids, size)
}

// BidPrice 买一价
func (o *OrderBook) BidPrice() (result float64) {
	if len(o.Bids) > 0 {
		result = o.Bids[0].Price
	}
	return
}

// Price returns the middle of Bid and Ask.
func (o *OrderBook) Price() float64 {
	latest := (o.Bid().Price + o.Ask().Price) / float64(2)
	return latest
}

// Record 表示K线数据
type Record struct {
	Symbol    string    `json:"symbol"`    // 标
	Timestamp time.Time `json:"timestamp"` // 时间
	Open      float64   `json:"open"`      // 开盘价
	High      float64   `json:"high"`      // 最高价
	Low       float64   `json:"low"`       // 最低价
	Close     float64   `json:"close"`     // 收盘价
	Volume    float64   `json:"volume"`    // 量
}

// Trade 成交记录
type Trade struct {
	ID        string    `json:"id"`     // ID
	Direction Direction `json:"type"`   // 主动成交方向
	Price     float64   `json:"price"`  // 价格
	Amount    float64   `json:"amount"` // 成交量(张)，买卖双边成交量之和
	Ts        int64     `json:"ts"`     // 订单成交时间 unix time (ms)
	Symbol    string    `json:"omitempty"`
}

// Order 委托
type Order struct {
	ID           string      `json:"id"`            // ID
	Symbol       string      `json:"symbol"`        // 标
	Price        float64     `json:"price"`         // 价格
	StopPx       float64     `json:"stop_px"`       // 触发价
	Amount       float64     `json:"amount"`        // 委托数量
	AvgPrice     float64     `json:"avg_price"`     // 平均成交价
	FilledAmount float64     `json:"filled_amount"` // 成交数量
	Direction    Direction   `json:"direction"`     // 委托方向
	Type         OrderType   `json:"type"`          // 委托类型
	PostOnly     bool        `json:"post_only"`     // 只做Maker选项
	ReduceOnly   bool        `json:"reduce_only"`   // 只减仓选项
	Status       OrderStatus `json:"status"`        // 委托状态
}

// IsOpen 是否活跃委托
func (o *Order) IsOpen() bool {
	return o.Status == OrderStatusCreated || o.Status == OrderStatusNew || o.Status == OrderStatusPartiallyFilled
}

// Position 持仓
type Position struct {
	Symbol    string    `json:"symbol"`     // 标
	OpenTime  time.Time `json:"open_time"`  // 开仓时间
	OpenPrice float64   `json:"open_price"` // 开仓价
	Size      float64   `json:"size"`       // 仓位大小
	AvgPrice  float64   `json:"avg_price"`  // 平均价
}

func (p *Position) Side() Direction {
	if p.Size > 0 {
		return Buy
	} else if p.Size < 0 {
		return Sell
	}
	return Buy
}

// IsOpen 是否持仓
func (p *Position) IsOpen() bool {
	return p.Size != 0
}

// IsLong 是否多仓
func (p *Position) IsLong() bool {
	return p.Size > 0
}

// IsShort 是否空仓
func (p *Position) IsShort() bool {
	return p.Size < 0
}
