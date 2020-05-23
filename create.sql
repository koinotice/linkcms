 



CREATE TABLE address (

  id SERIAL PRIMARY KEY,
  account_id INT,
  dex TEXT,
  address TEXT,
  access_key TEXT,
  secret_key TEXT,
  alias TEXT,
  create_at date DEFAULT now()
);


CREATE TABLE balances (
  id SERIAL PRIMARY KEY, 
  
  accountId     integer not null,
  bull    NUMERIC,
  bear    NUMERIC,
  bullblock    NUMERIC,
  bearblock    NUMERIC,
  usdt    NUMERIC, 
  usdtblock NUMERIC, 
  eth NUMERIC ,
  ethblock NUMERIC,
  time        TIMESTAMPTZ       DEFAULT now()

);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY, 
  
  accountId     integer not null,
  bull    NUMERIC,
  bear    NUMERIC,
  bullblock    NUMERIC,
  bearblock    NUMERIC,
  usdt    NUMERIC, 
  usdtblock NUMERIC, 
  eth NUMERIC ,
  ethblock NUMERIC,
  time        TIMESTAMPTZ     DEFAULT now()

);