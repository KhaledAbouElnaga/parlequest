PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS pq_users (
 id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL COLLATE NOCASE,
 display_name TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','student')),
 status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','suspended')),
 password_hash TEXT, invite_hash TEXT UNIQUE, invite_expires INTEGER,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS pq_sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES pq_users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS pq_sessions_user ON pq_sessions(user_id);
CREATE TABLE IF NOT EXISTS pq_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS pq_audit (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, target_id TEXT NOT NULL, action TEXT NOT NULL, created_at INTEGER NOT NULL);
