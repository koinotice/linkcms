-- -------------------------------------------------------------
-- TablePlus 3.4.0(304)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2020-05-29 15:46:59.1600
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

INSERT INTO "public"."address" ("id", "account_id", "dex", "address", "access_key", "secret_key", "alias", "bull", "bear", "usdt", "create_at") VALUES
('1', '6', 'wedex', '0x703fE1A7331375AbACbC25d556624e65e3dc0877', 'iLIjQq6NCZEIfyn2R1lgB99EMwpoaBaQ8a9mHAmSXtPqhyy7VErNpsjsECKXUQNi', NULL, 'wedex熊证摆单2', '0', '220', '1000', '2020-05-27'),
('2', '2229', 'wedex', '0xa217dc08783bF03c871E91E7D46E309B6DB42505', 'PpLEb9rAs9CzdB5w0xfKWm8gxEePCzmFlyyGG5xDy54X0hc5RxDYDVP5LWlzfeOz', NULL, 'wedex牛证摆单2', '220', '0', '2000', '2020-05-27'),
('3', '2292', 'wedex', '0x822eaBa527600b26F6519176Ecf54760d2adF054', '7GicRLLik1983KhJq0Oi5XItexI7JwVjCPvJqcrg6SE2QOyUCQIoMqW2AZDALymG', NULL, 'wedex牛证摆单1', '200', '0', '2000', '2020-05-27'),
('4', '2293', 'wedex', '0x77fAa0Fd092619bC1a0BE349488F5d2Ab9a17DB4', 'Avt69x5rfpazpjgfqoII6wl8eon69WuFbt0nmrHuZC0cwZ2vDpfkwwXmSDdxpGcD', NULL, 'wedex熊证摆单', '0', '200', '2000', '2020-05-27'),
('5', '2296', 'wedex', '0xa748616e0382e8bd458c74ab8ada8be599747bae', '38aMSy6baZbgGncpk9StKq4mqZf1NnREHNJeZfuK3GyWwUrRS47OpxETW3EuWMb5', NULL, 'wedex熊证量化1', '0', '100', '5000', '2020-05-27'),
('6', '2311', 'wedex', '0xf4517838334b2eade114e59896b80cbecb494944', 'l0LeLU2dyes8anBxPD6LzTZVGU0YheMjo5TAOexO0k8Qjka0qgDprpq4tmzdZjnk', NULL, 'wedex牛证量化1', '100', '0', '5000', '2020-05-27'),
('7', '1', 'dron', '0x262fffc8ed3d5e6ba926a433728dab85', '262fffc8ed3d5e6ba926a433728dab85', 'b12058926c145f32a9fa14bc6fc0d53f', '龙网牛证摆单1', '2000', '0', '50000', '2020-05-27'),
('8', '2', 'dron', '0x7a0xc2dd8c78d5562b8c05ba34a55dbba4', '7ac2dd8c78d5562b8c05ba34a55dbba4', 'dce8958bc91e5adca5f32d454dfda17c', '龙网熊证摆单1', '0', '2000', '50000', '2020-05-27');
