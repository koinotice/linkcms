package bitmexsim

import (
	. "github.com/koinotice/redox/packages/crex"
)

func testExchange() Exchange {
	return NewBitMEXSim(nil, 10000, 0, 0)
}
