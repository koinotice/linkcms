package dataloader

import (
	"context"
	"fmt"
	. "github.com/koinotice/redox/packages/crex"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"sync"
	"time"
)

type mItem [2]float64

type mOrderBook struct {
	ID        primitive.ObjectID `bson:"_id"`
	Timestamp int64              `bson:"t"`
	Asks      []mItem            `bson:"a"`
	Bids      []mItem            `bson:"b"`
}

type MongoDBDataLoader struct {
	client      *mongo.Client
	database    *mongo.Database
	collection  *mongo.Collection
	exchange    string
	symbol      string
	start       int64
	end         int64
	limit       int
	ctx         context.Context
	cur         *mongo.Cursor
	filter      primitive.M
	hasMoreData bool
}

func (l *MongoDBDataLoader) Setup(start time.Time, end time.Time) error {
	l.start = start.UnixNano() / int64(time.Millisecond)
	l.end = end.UnixNano() / int64(time.Millisecond)
	l.filter = bson.M{"t": bson.M{"$gte": l.start, "$lte": l.end}}
	l.open()
	return nil
}

func (l *MongoDBDataLoader) ReadData() (result []*OrderBook) {
	if !l.hasMoreData {
		return nil
	}

	var batch = make([]bson.Raw, 0, l.limit)
	for l.cur.Next(l.ctx) {
		batch = append(batch, l.cur.Current)
		if len(batch) >= l.limit {
			break
		}
	}

	if err := l.cur.Err(); err != nil {
		log.Fatal(err)
	}

	return l.convert(batch...)
}

func (l *MongoDBDataLoader) convert(r ...bson.Raw) (result []*OrderBook) {
	n := len(r)
	var wg sync.WaitGroup
	result = make([]*OrderBook, 0, n)
	wg.Add(n)
	for i := 0; i < n; i++ {
		ob := &OrderBook{}
		result = append(result, ob)
		raw := &r[i]
		go func() {
			UnmarshalOrderBook(raw, ob)
			wg.Done()
		}()
	}
	wg.Wait()
	return
}

func UnmarshalOrderBook(raw *bson.Raw, ob *OrderBook) {
	timestamp := raw.Lookup("t").Int64()
	ob.Time = time.Unix(0, timestamp*int64(time.Millisecond))
	asks, _ := raw.Lookup("a").Array().Values()
	bids, _ := raw.Lookup("b").Array().Values()

	ob.Asks = make([]Item, 0, len(asks))
	ob.Bids = make([]Item, 0, len(bids))

	for _, v := range asks {
		vv, _ := v.Array().Values()
		ob.Asks = append(ob.Asks, Item{
			Price:  vv[0].Double(),
			Amount: vv[1].Double(),
		})
	}
	for _, v := range bids {
		vv, _ := v.Array().Values()
		ob.Bids = append(ob.Bids, Item{
			Price:  vv[0].Double(),
			Amount: vv[1].Double(),
		})
	}
}

func (l *MongoDBDataLoader) convertOrderBook(items ...mItem) (result []Item) {
	for _, v := range items {
		result = append(result, Item{
			Price:  v[0],
			Amount: v[1],
		})
	}
	return
}

func (l *MongoDBDataLoader) HasMoreData() bool {
	return l.hasMoreData
}

func (l *MongoDBDataLoader) open() {
	name := fmt.Sprintf("%v:%v", l.exchange, l.symbol)
	l.collection = l.database.Collection(name)
	findOptions := options.Find()
	// Sort by `t` field asc
	findOptions.SetSort(bson.D{{"t", 1}})
	cur, err := l.collection.Find(context.TODO(), l.filter, findOptions)
	if err != nil {
		log.Printf("%v", err)
		return
	}
	l.cur = cur
}

func (l *MongoDBDataLoader) close() {
	if l.cur != nil {
		l.cur.Close(l.ctx)
	}
	if l.client != nil {
		l.client.Disconnect(l.ctx)
	}
	l.hasMoreData = false
}

func NewMongoDBDataLoader(uri string, db string, exchange string, symbol string) *MongoDBDataLoader {
	clientOptions := options.Client().ApplyURI(uri)
	// compressors: snappy/zlib/zstd
	clientOptions = clientOptions.SetCompressors([]string{"snappy"})
	var client *mongo.Client
	var err error
	if client, err = mongo.Connect(
		context.TODO(), clientOptions); err != nil {
		return nil
	}

	database := client.Database(db)
	loader := &MongoDBDataLoader{
		client:      client,
		database:    database,
		exchange:    exchange,
		symbol:      symbol,
		ctx:         context.TODO(),
		limit:       100000,
		hasMoreData: true,
	}
	return loader
}

func NewMongoDBData(uri string, db string, exchange string, symbol string) *Data {
	loader := NewMongoDBDataLoader(uri, db, exchange, symbol)
	return &Data{
		index:      0,
		maxIndex:   0,
		data:       nil,
		dataLoader: loader,
	}
}
