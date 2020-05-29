package model

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"time"
)


var DB *gorm.DB
type ModelId struct {
	//Id SERIAL `gorm:"PRIMARY_KEY;AUTO_INCREMENT" json:"id" form:"id"`
	Id int64 `gorm:"type: serial;"`
}
func Connect(url string) *gorm.DB {
	db, err := gorm.Open("postgres", url)

	if err != nil {
		fmt.Printf(err.Error())
		panic(err)
	}
	//db.SetLogger(gorm.Logger{revel.TRACE})
	///db.SetLogger(log.New(os.Stdout, "\r\n", 0))


	gorm.NowFunc = func() time.Time {
		return time.Now().UTC()
	}

	DB = db
	return db
}
