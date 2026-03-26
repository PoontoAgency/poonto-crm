-- ============================================================
-- MIGRAZIONE 002 — Row Level Security
-- Isolamento multi-tenant basato su workspace membership
-- ============================================================

-- Helper: workspace IDs dell'utente corrente
CREATE OR REPLACE FUNCTION user_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT workspace_id FROM workspace_members
  WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: include sotto-workspace (per agenzie)
CREATE OR REPLACE FUNCTION user_all_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT id FROM workspaces
  WHERE id IN (SELECT user_workspace_ids())
     OR parent_workspace_id IN (SELECT user_workspace_ids())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws_read" ON workspaces FOR SELECT
  USING (id IN (SELECT user_all_workspace_ids()));
CREATE POLICY "ws_insert" ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "ws_update" ON workspaces FOR UPDATE
  USING (owner_id = auth.uid());

-- Workspace Members
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_read" ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT user_all_workspace_ids()));
CREATE POLICY "members_manage" ON workspace_members FOR ALL
  USING (workspace_id IN (
    SELECT wm.workspace_id FROM workspace_members wm
    WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin')
  ));

-- Contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_all" ON contacts FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Pipelines
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pipelines_all" ON pipelines FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Pipeline Stages
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stages_all" ON pipeline_stages FOR ALL
  USING (pipeline_id IN (
    SELECT id FROM pipelines WHERE workspace_id IN (SELECT user_all_workspace_ids())
  ));

-- Deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deals_all" ON deals FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_all" ON tasks FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activities_all" ON activities FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Attachments
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attachments_all" ON attachments FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- Custom Field Defs
ALTER TABLE custom_field_defs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fields_all" ON custom_field_defs FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));

-- AI Cache
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_cache_all" ON ai_cache FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));
