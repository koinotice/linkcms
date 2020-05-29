-- -------------------------------------------------------------
-- TablePlus 3.4.0(304)
--
-- https://tableplus.com/
--
-- Database: postgres
-- Generation Time: 2020-05-27 18:37:44.1240
-- -------------------------------------------------------------


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

