-- -------------------------------------------------------------
-- TablePlus 3.4.0(304)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2020-05-29 15:04:20.0050
-- -------------------------------------------------------------


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

