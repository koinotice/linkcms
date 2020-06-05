# linkcms


SELECT 
sum(b.bull) as bulls,
sum(b.bear) as bears ,
a.dex
from assets  as b
left join address  as a on b.accountid=a.account_id
group by a.dex



SELECT 
 
sum(a.bull-b.bull) as 卖出bull,
sum(a.bear-b.bear) as 卖出bear,
sum(a.usdt-b.usdt) as 赚usdt
 
from assets  as b
left join address as a
on a.account_id=b.accountid


 CREATE TABLE exchange (
id SERIAL PRIMARY KEY,
exchange text,
contract text,
keep NUMERIC default 0,
profitunreal    NUMERIC default 0,
riskrate    NUMERIC default 0,
time        TIMESTAMPTZ     DEFAULT now()

);


CREATE TABLE contract (
id SERIAL PRIMARY KEY,
exchange text,
direct text,
amount    NUMERIC default 0,
priceavg    NUMERIC default 0,
profitreal   NUMERIC default 0,
leverrate   NUMERIC default 0,
symbole   text,
contracttype   text,
 
time        TIMESTAMPTZ     DEFAULT now()

);


CREATE TABLE worth (
id SERIAL PRIMARY KEY,
symbol text,
 
lastWorth    NUMERIC default 0,
currWorth    NUMERIC default 0,
lastPrice   NUMERIC default 0,
currPrice   NUMERIC default 0, 
time        TIMESTAMPTZ     DEFAULT now()

);

{"symbol":"3BBULL","lastWorth":86.48,"currWorth":89.05,"lastPrice":8810.56,"currPrice":8898.02}



select 
exchange 交易所,
amount 数量,
priceavg 开仓价,
profitreal 未实现盈亏,
leverrate 倍数, 
forceliquprice 强平价

from contract




SELECT exchange, keep 保证金,
profitunreal 未实现盈亏,
accountrights 钱包余额   from exchange



query getAddress {
  address{
  id,
  bear
  balance{
      bear,
      bull
    }
  }
  
}