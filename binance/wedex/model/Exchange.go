package model



//func (dw *DBExtension) SaveOne(value TableNameAble) error {
//	tableNameAble, ok := value.(TableNameAble)
//	if !ok {
//		return ftm.log.New("value doesn't implement TableNameAble")
//	}
//
//	var err error
//	if err = dw.Save(value).Error; err != nil {
//		dw.logger.LogErrorc("mysql", err, fmt.Sprintf("Failed to save %s, the value is %+v", tableNameAble.TableName(), value))
//	}
//	return err
//}


type Exchange struct {

	//ID            int64   `db:"id" auto:"true" primaryKey:"true" autoIncrement:"true" gorm:"primary_key"`
	Exchange  string    `gorm:"column:exchange" json:"exchange" gorm:"not null;"`
	Contract string    `gorm:"column:contract" json:"contract" `
	AccountRights    float64    `gorm:"column:accountrights" json:"accountrights"`
	Keep    float64    `gorm:"column:keep" json:"keep"`
	ProfitUnreal       float64    `gorm:"column:profitunreal" json:"profitunreal" gorm:"not null;"`
	RiskRate       float64    `gorm:"column:riskrate" json:"riskrate" gorm:"not null; "`



}



func (Exchange) TableName() string {
	return "exchange"
}

func (Exchange) Upsert(exchange *Exchange) error {

	//DB.Where(gorm.entity.AggregatedData{Type: v.Type}).Assign(entity.AggregatedData{Type: v.Type, Data: v.Data}).FirstOrCreate(v)

	DB.Where(Exchange{
		Exchange: exchange.Exchange,
	}).Assign(Exchange{
		ProfitUnreal:exchange.ProfitUnreal,
		AccountRights: exchange.AccountRights,
		Keep: exchange.Keep,
	}).FirstOrCreate(&exchange)
	//DB.Where(User{Name: "Jinzhu"}).FirstOrCreate(&user)
	//Db.Where(User{Name: "non_existing"}).Assign(User{Age: 20}).FirstOrCreate(&user)


	return nil
	//return DB.Create(order).Error
}
