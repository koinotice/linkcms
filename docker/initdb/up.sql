CREATE DATABASE dev;
 


DROP TABLE IF EXISTS users;
CREATE TABLE users (
    name text,
    created timestamp with time zone
);


insert into users values ('alice', now() - interval '4 days');
insert into users values ('bob', now() - interval '4 days');
insert into users values ('charlie', now() - interval '3 days');
insert into users values ('david', now() - interval '3 days');
insert into users values ('eric', now() - interval '3 days');
insert into users values ('felix', now() - interval '2 days');
insert into users values ('george', now() - interval '1 days');
insert into users values ('harvey', now() - interval '1 days');
insert into users values ('ian', now() - interval '0 days');

DROP TABLE IF EXISTS pipeline_stages;
CREATE TABLE pipeline_stages (
    project text,
    stage integer,
    started timestamp with time zone,
    ended timestamp with time zone,
    failed bool
);

WITH vars AS (SELECT md5(random()::text) AS name, now()-(random()*interval '7 day') AS basetime)
INSERT INTO pipeline_stages (project, stage, started, ended, failed) VALUES
    ((select name from vars), 1, (select basetime - interval '6 min' from vars), (select basetime - interval '5 min' - (random()*interval '10 seconds') from vars), 'f'),
    ((select name from vars), 2, (select basetime - interval '5 min' from vars), (select basetime - interval '4 min' - (random()*interval '50 seconds') from vars), 'f'),
    ((select name from vars), 3, (select basetime - interval '4 min' from vars), (select basetime - interval '3 min' - (random()*interval '10 seconds') from vars), 'f'),
    ((select name from vars), 4, (select basetime - interval '3 min' from vars), (select basetime - interval '2 min' - (random()*interval '40 seconds') from vars), 'f');
