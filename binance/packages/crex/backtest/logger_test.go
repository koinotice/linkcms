package backtest

import (
	"github.com/koinotice/redox/packages/crex/log"
	"testing"
)

func TestBtLogger(t *testing.T) {
	//bt := NewBacktest(nil, "", [strategy], nil)
	logger := NewBtLogger(nil,
		"../testdata/btlog.log", log.DebugLevel, false, true)
	defer logger.Sync()

	logger.Debug("hello", "world")
	logger.Info("hello")
	logger.Info("hello", "world")
}
