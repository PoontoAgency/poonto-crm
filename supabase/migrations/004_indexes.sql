-- ============================================================
-- MIGRAZIONE 004 — Indici
-- ============================================================

-- Contacts
CREATE INDEX idx_contacts_workspace    ON contacts(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_search       ON contacts(workspace_id, first_name, last_name);
CREATE INDEX idx_contacts_email        ON contacts(workspace_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_tags         ON contacts USING GIN(tags);

-- Deals
CREATE INDEX idx_deals_workspace       ON deals(workspace_id);
CREATE INDEX idx_deals_pipeline_stage  ON deals(pipeline_id, stage_id) WHERE status = 'open';
CREATE INDEX idx_deals_contact         ON deals(contact_id);

-- Tasks
CREATE INDEX idx_tasks_workspace       ON tasks(workspace_id);
CREATE INDEX idx_tasks_due             ON tasks(workspace_id, due_date) WHERE completed_at IS NULL;
CREATE INDEX idx_tasks_assigned        ON tasks(assigned_to, due_date) WHERE completed_at IS NULL;

-- Activities
CREATE INDEX idx_activities_contact    ON activities(contact_id, created_at DESC);
CREATE INDEX idx_activities_workspace  ON activities(workspace_id, created_at DESC);

-- Members
CREATE INDEX idx_members_user          ON workspace_members(user_id);

-- AI Cache
CREATE INDEX idx_ai_cache_entity       ON ai_cache(entity_type, entity_id, ai_type);
