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