BEGIN;
CREATE TABLE pgq_jobs (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  queue_name TEXT NOT NULL,
  data BYTEA NOT NULL,
  run_after TIMESTAMP WITH TIME ZONE NOT NULL,
  retry_waits TEXT[] NOT NULL,
  ran_at TIMESTAMP WITH TIME ZONE,
  error TEXT
);

-- Add an index for fast fetching of jobs by queue_name, sorted by run_after.  But only
-- index jobs that haven''t been done yet, in case the user is keeping the job history around.
CREATE INDEX idx_pgq_jobs_fetch
	ON pgq_jobs (queue_name, run_after)
	WHERE ran_at IS NULL;
COMMIT;




CREATE TABLE IF NOT EXISTS ServerInfo (uniquerow INTEGER DEFAULT 1, id VARCHAR(1024), proto BYTEA, version INTEGER, PRIMARY KEY (uniquerow));
CREATE TABLE IF NOT EXISTS Clients (id VARCHAR(1024), hbinbox TEXT, PRIMARY KEY (id));
CREATE TABLE IF NOT EXISTS Channels (id INTEGER, name VARCHAR(1024) NOT NULL, maxseq BIGINT DEFAULT 0, maxmsgs INTEGER DEFAULT 0, maxbytes BIGINT DEFAULT 0, maxage BIGINT DEFAULT 0, deleted BOOL DEFAULT FALSE, PRIMARY KEY (id));
CREATE INDEX Idx_ChannelsName ON Channels (name(256));
CREATE TABLE IF NOT EXISTS Messages (id INTEGER, seq BIGINT, timestamp BIGINT, size INTEGER, data BYTEA, CONSTRAINT PK_MsgKey PRIMARY KEY(id, seq));
CREATE INDEX Idx_MsgsTimestamp ON Messages (timestamp);
CREATE TABLE IF NOT EXISTS Subscriptions (id INTEGER, subid BIGINT, lastsent BIGINT DEFAULT 0, proto BYTEA, deleted BOOL DEFAULT FALSE, CONSTRAINT PK_SubKey PRIMARY KEY(id, subid));
CREATE TABLE IF NOT EXISTS SubsPending (subid BIGINT, row BIGINT, seq BIGINT DEFAULT 0, lastsent BIGINT DEFAULT 0, pending BYTEA, acks BYTEA, CONSTRAINT PK_MsgPendingKey PRIMARY KEY(subid, row));
CREATE INDEX Idx_SubsPendingSeq ON SubsPending (seq);
CREATE TABLE IF NOT EXISTS StoreLock (id VARCHAR(30), tick BIGINT DEFAULT 0);

-- Updates for 0.10.0
ALTER TABLE Clients ADD proto BYTEA;

CREATE DATABASE mainnet;
CREATE DATABASE rinkeby;