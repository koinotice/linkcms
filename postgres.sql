-- -------------------------------------------------------------
-- TablePlus 3.4.0(304)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2020-05-29 17:13:28.0970
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."address";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS address_id_seq;

-- Table Definition
CREATE TABLE "public"."address" (
    "id" int4 NOT NULL DEFAULT nextval('address_id_seq'::regclass),
    "account_id" int4,
    "dex" text DEFAULT 'wedex'::text,
    "address" text,
    "access_key" text,
    "secret_key" text,
    "alias" text,
    "bull" numeric DEFAULT 0,
    "bear" numeric DEFAULT 0,
    "usdt" numeric DEFAULT 0,
    "create_at" date DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."assets";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS assets_id_seq;

-- Table Definition
CREATE TABLE "public"."assets" (
    "id" int4 NOT NULL DEFAULT nextval('assets_id_seq'::regclass),
    "bull" numeric DEFAULT 0,
    "bear" numeric DEFAULT 0,
    "bullblock" numeric DEFAULT 0,
    "bearblock" numeric DEFAULT 0,
    "usdt" numeric DEFAULT 0,
    "usdtblock" numeric DEFAULT 0,
    "eth" numeric DEFAULT 0,
    "ethblock" numeric,
    "time" timestamptz DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."contract";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."contract" (
    "exchange" text NOT NULL,
    "direct" text,
    "amount" numeric DEFAULT 0,
    "priceavg" numeric DEFAULT 0,
    "profitreal" numeric DEFAULT 0,
    "leverrate" numeric DEFAULT 0,
    "symbole" text,
    "contracttype" text,
    "time" timestamptz DEFAULT now(),
    "forceliquprice" numeric,
    PRIMARY KEY ("exchange")
);

DROP TABLE IF EXISTS "public"."exchange";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."exchange" (
    "exchange" text NOT NULL,
    "contract" text,
    "keep" numeric DEFAULT 0,
    "profitunreal" numeric DEFAULT 0,
    "riskrate" numeric DEFAULT 0,
    "time" timestamptz DEFAULT now(),
    "currency" text,
    "accountrights" numeric,
    PRIMARY KEY ("exchange")
);

DROP TABLE IF EXISTS "public"."worth";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS worth_id_seq;

-- Table Definition
CREATE TABLE "public"."worth" (
    "id" int4 NOT NULL DEFAULT nextval('worth_id_seq'::regclass),
    "symbol" text,
    "lastworth" numeric DEFAULT 0,
    "currworth" numeric DEFAULT 0,
    "lastprice" numeric DEFAULT 0,
    "currprice" numeric DEFAULT 0,
    "time" timestamptz DEFAULT now(),
    PRIMARY KEY ("id")
);

INSERT INTO "public"."address" ("id", "account_id", "dex", "address", "access_key", "secret_key", "alias", "bull", "bear", "usdt", "create_at") VALUES
('1', '6', 'wedex', '0x703fE1A7331375AbACbC25d556624e65e3dc0877', 'iLIjQq6NCZEIfyn2R1lgB99EMwpoaBaQ8a9mHAmSXtPqhyy7VErNpsjsECKXUQNi', NULL, 'wedex熊证摆单2', '0', '220', '1000', '2020-05-27'),
('2', '2229', 'wedex', '0xa217dc08783bF03c871E91E7D46E309B6DB42505', 'PpLEb9rAs9CzdB5w0xfKWm8gxEePCzmFlyyGG5xDy54X0hc5RxDYDVP5LWlzfeOz', NULL, 'wedex牛证摆单2', '220', '0', '2000', '2020-05-27'),
('3', '2292', 'wedex', '0x822eaBa527600b26F6519176Ecf54760d2adF054', '7GicRLLik1983KhJq0Oi5XItexI7JwVjCPvJqcrg6SE2QOyUCQIoMqW2AZDALymG', NULL, 'wedex牛证摆单1', '200', '0', '2000', '2020-05-27'),
('4', '2293', 'wedex', '0x77fAa0Fd092619bC1a0BE349488F5d2Ab9a17DB4', 'Avt69x5rfpazpjgfqoII6wl8eon69WuFbt0nmrHuZC0cwZ2vDpfkwwXmSDdxpGcD', NULL, 'wedex熊证摆单', '0', '200', '2000', '2020-05-27'),
('5', '2296', 'wedex', '0xa748616e0382e8bd458c74ab8ada8be599747bae', '38aMSy6baZbgGncpk9StKq4mqZf1NnREHNJeZfuK3GyWwUrRS47OpxETW3EuWMb5', NULL, 'wedex熊证量化1', '0', '100', '5000', '2020-05-27'),
('6', '2311', 'wedex', '0xf4517838334b2eade114e59896b80cbecb494944', 'l0LeLU2dyes8anBxPD6LzTZVGU0YheMjo5TAOexO0k8Qjka0qgDprpq4tmzdZjnk', NULL, 'wedex牛证量化1', '100', '0', '5000', '2020-05-27'),
('7', '1', 'dron', '0x262fffc8ed3d5e6ba926a433728dab85', '262fffc8ed3d5e6ba926a433728dab85', 'b12058926c145f32a9fa14bc6fc0d53f', '龙网牛证摆单1', '2000', '0', '50000', '2020-05-27'),
('8', '2', 'dron', '0x7a0xc2dd8c78d5562b8c05ba34a55dbba4', '7ac2dd8c78d5562b8c05ba34a55dbba4', 'dce8958bc91e5adca5f32d454dfda17c', '龙网熊证摆单1', '0', '2000', '50000', '2020-05-27');

INSERT INTO "public"."assets" ("id", "bull", "bear", "bullblock", "bearblock", "usdt", "usdtblock", "eth", "ethblock", "time") VALUES
('1', '1969.0915', '0', '0', '136.8100', '53364.45227999', '0', '0', NULL, '2020-05-27 10:57:23.742828+00'),
('2', '0', '1800.2553', '264.3700', '0', '67099.61318899', '0', '0.2000', NULL, '2020-05-27 10:57:24.484017+00'),
('6', '0', '184.1000', '0', '170.1600', '4421.8200', '3857.2400', '0', NULL, '2020-05-27 10:59:00.709244+00'),
('2229', '196.1900', '0', '102.0700', '0', '4275.7500', '4565.9900', '0', NULL, '2020-05-27 10:59:01.172483+00'),
('2292', '209.4700', '0', '109.3300', '0', '940.7000', '1795.0100', '0', NULL, '2020-05-27 10:59:01.668215+00'),
('2293', '0', '184.2500', '0', '167.9800', '3307.9800', '2294.8800', '0', NULL, '2020-05-27 10:59:02.13+00'),
('2296', '0.0100', '127.2000', '0', '0', '2567.9500', '0', '0', NULL, '2020-05-27 10:59:02.580303+00'),
('2311', '96.8100', '0.0100', '0', '0', '4636.3800', '0', '0', NULL, '2020-05-27 10:59:03.059154+00');

INSERT INTO "public"."contract" ("exchange", "direct", "amount", "priceavg", "profitreal", "leverrate", "symbole", "contracttype", "time", "forceliquprice") VALUES
('Binana-BTC/USDT-多单', '多单', '0.7', '9232.82252', '160.65847734', '100', '', NULL, '2020-05-29 07:05:22.999134+00', '104869558.15'),
('Binana-BTC/USDT-空单', '空单', '-0.64', '8870.19231', '-377.07913556', '100', '', NULL, '2020-05-29 07:05:21.819184+00', '9856.26');

INSERT INTO "public"."exchange" ("exchange", "contract", "keep", "profitunreal", "riskrate", "time", "currency", "accountrights") VALUES
('binanace-BNB', '永续', '0.00006573', '0', '0', '2020-05-29 07:05:19.884349+00', NULL, '0.00006573'),
('binanace-USDT', '永续', '279.25025187', '-377.06458592', '-186.3529704', '2020-05-29 07:05:21.036047+00', NULL, '656.31483779');

INSERT INTO "public"."worth" ("id", "symbol", "lastworth", "currworth", "lastprice", "currprice", "time") VALUES
('1', '3BBULL', '123.5500', '119.6200', '9571.3100', '9469.4200', '2020-05-29 08:39:25.376747+00'),
('2', '3BBEAR', '76.1500', '78.5700', '9571.3100', '9469.9800', '2020-05-29 08:38:56.377863+00');

