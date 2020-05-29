package model


type Contract struct {
	//ID            int64   `db:"id" auto:"true" primaryKey:"true" autoIncrement:"true" gorm:"primary_key"`
	Exchange  string    `gorm:"column:exchange" json:"exchange" gorm:"not null;"`
	Direct string    `gorm:"column:direct" json:"direct" `
	Symbole string    `gorm:"column:symbole" json:"symbole" `
	Amount    float64    `gorm:"column:amount" json:"amount"`
	PriceAvg    float64    `gorm:"column:priceavg" json:"priceavg"`
	ProfitReal       float64    `gorm:"column:profitreal" json:"profitreal" gorm:"not null;"`
	LeverRate       int    `gorm:"column:leverrate" json:"leverrate" gorm:"not null; "`
	ForceLiquPrice   float64    `gorm:"column:forceliquprice" json:"forceliquprice" gorm:"not null; "`

}

func (Contract) TableName() string {
	return "contract"
}


func (Contract) Upsert(order *Contract) error {

	//DB.Where(gorm.entity.AggregatedData{Type: v.Type}).Assign(entity.AggregatedData{Type: v.Type, Data: v.Data}).FirstOrCreate(v)

	DB.Where(Contract{
		Exchange: order.Exchange,
	}).Assign(Contract{
		Amount:order.Amount,
		PriceAvg: order.PriceAvg,
		ProfitReal: order.ProfitReal,
		LeverRate: order.LeverRate,
		ForceLiquPrice:order.ForceLiquPrice,
	}).FirstOrCreate(&order)

	return nil

}
