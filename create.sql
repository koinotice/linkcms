 



CREATE TABLE address (

  id SERIAL PRIMARY KEY,
  account_id INT,
  dex TEXT,
  address TEXT,
  access_key TEXT,
  secret_key TEXT,
  alias TEXT,
  bull    NUMERIC default 0,
  bear    NUMERIC default  0,
  usdt NUMERIC default  0,
  create_at date DEFAULT now()
);


CREATE TABLE balances (
  id SERIAL PRIMARY KEY, 
  
  accountId     integer not null,
  bull    NUMERIC default 0,
  bear    NUMERIC default 0,
  bullblock    NUMERIC default 0,
  bearblock   NUMERIC default 0,
  usdt    NUMERIC default 0,
  usdtblock NUMERIC default 0,
  eth NUMERIC default 0,
  ethblock NUMERIC default 0,
  time        TIMESTAMPTZ       DEFAULT now()

);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY, 
  
  accountId     integer not null,
  bull    NUMERIC default 0,
  bear   NUMERIC default 0,
  bullblock   NUMERIC default 0,
  bearblock   NUMERIC default 0,
  usdt    NUMERIC default 0,
  usdtblock NUMERIC default 0,
  eth NUMERIC default 0,
  ethblock NUMERIC,
  time        TIMESTAMPTZ     DEFAULT now()

);


CREATE TABLE dkey (
  id SERIAL PRIMARY KEY, 
  
  
  bull    NUMERIC default 0,
  bear   NUMERIC default 0,
  bullnum   NUMERIC default 0,
  bearnum   NUMERIC default 0, 
  time        TIMESTAMPTZ     DEFAULT now()

);