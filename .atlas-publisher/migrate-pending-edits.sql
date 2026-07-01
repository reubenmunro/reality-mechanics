-- AI Garden Inbox: pending edits submitted by AI clients via submit_atlas_insert.
-- No Garden secret required to write here; automation workers promote rows to canonical
-- Garden proposals, applied section updates, or rejected/shaded items.
--
-- Run against atlas-d1:
--   npx wrangler d1 execute atlas-d1 --file=.atlas-publisher/migrate-pending-edits.sql --remote

CREATE TABLE IF NOT EXISTS atlas_pending_edits (
  id               TEXT PRIMARY KEY,          -- uuid-like: <entry_id>-<timestamp>-<random>
  target_entry_id  TEXT NOT NULL,             -- Atlas entry ID the edit targets
  target_section   TEXT NOT NULL DEFAULT '',  -- section heading, e.g. "Reads", "Places", ""
  insert_mode      TEXT NOT NULL,             -- append | replace_section | suggest_new_entry | link_related
  proposed_text    TEXT NOT NULL,             -- the candidate text
  reason           TEXT NOT NULL DEFAULT '',  -- why the AI is proposing this
  confidence       TEXT NOT NULL DEFAULT 'low', -- high | medium | low
  related_terms    TEXT NOT NULL DEFAULT '[]',  -- JSON array of Atlas entry IDs
  source           TEXT NOT NULL DEFAULT 'ai_chat', -- ai_chat | api | test
  status           TEXT NOT NULL DEFAULT 'pending',
    -- pending | worker_reviewed | prepared | applied | rejected
  content_hash     TEXT NOT NULL DEFAULT '',  -- sha256 of target_entry_id:target_section:proposed_text
  submitted_at     TEXT NOT NULL,             -- ISO timestamp
  reviewed_at      TEXT,                      -- ISO timestamp when status changed from pending
  worker_note      TEXT,                      -- human or automation note added during review
  garden_proposal_id TEXT                     -- id of resulting Garden proposal, if promoted
);

CREATE INDEX IF NOT EXISTS idx_pending_edits_entry
  ON atlas_pending_edits (target_entry_id);

CREATE INDEX IF NOT EXISTS idx_pending_edits_status
  ON atlas_pending_edits (status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_pending_edits_hash
  ON atlas_pending_edits (content_hash);
