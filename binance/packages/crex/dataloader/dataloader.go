package dataloader

import (
	. "github.com/koinotice/redox/packages/crex"
	"time"
)

type DataLoader interface {
	Setup(start time.Time, end time.Time) error
	ReadData() []*OrderBook
	HasMoreData() bool
}
