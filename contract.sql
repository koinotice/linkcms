-- -------------------------------------------------------------
-- TablePlus 3.4.0(304)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2020-05-29 15:03:24.0120
-- -------------------------------------------------------------


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

