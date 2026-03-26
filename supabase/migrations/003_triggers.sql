-- ============================================================
-- MIGRAZIONE 003 — Trigger e Funzioni
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workspaces_updated BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default pipeline + stadi per nuovo workspace
CREATE OR REPLACE FUNCTION seed_new_workspace()
RETURNS TRIGGER AS $$
DECLARE
  v_pipeline_id UUID;
BEGIN
  -- Crea membership owner
  INSERT INTO workspace_members (workspace_id, user_id, role, accepted_at)
  VALUES (NEW.id, NEW.owner_id, 'owner', NOW());

  -- Crea pipeline default
  INSERT INTO pipelines (workspace_id, name, is_default)
  VALUES (NEW.id, 'Vendite', true) RETURNING id INTO v_pipeline_id;

  -- Crea stadi default
  INSERT INTO pipeline_stages (pipeline_id, name, position, probability, color) VALUES
    (v_pipeline_id, 'Lead',          1, 20, '#6366F1'),
    (v_pipeline_id, 'Contattato',    2, 40, '#8B5CF6'),
    (v_pipeline_id, 'Proposta',      3, 60, '#EC4899'),
    (v_pipeline_id, 'Negoziazione',  4, 80, '#F59E0B'),
    (v_pipeline_id, 'Chiuso',        5, 100, '#22C55E');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_seed_workspace AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION seed_new_workspace();

-- Log attività su spostamento deal
CREATE OR REPLACE FUNCTION log_deal_move()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
    INSERT INTO activities (workspace_id, contact_id, deal_id, type, content, metadata, created_by)
    VALUES (
      NEW.workspace_id,
      NEW.contact_id,
      NEW.id,
      'deal_move',
      'Deal spostato in nuovo stadio',
      jsonb_build_object('from_stage', OLD.stage_id, 'to_stage', NEW.stage_id),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deal_move AFTER UPDATE OF stage_id ON deals
  FOR EACH ROW EXECUTE FUNCTION log_deal_move();

-- Log attività su completamento task
CREATE OR REPLACE FUNCTION log_task_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
    INSERT INTO activities (workspace_id, contact_id, deal_id, type, content, created_by)
    VALUES (
      NEW.workspace_id,
      NEW.contact_id,
      NEW.deal_id,
      'task_complete',
      'Task completato: ' || NEW.title,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_task_complete AFTER UPDATE OF completed_at ON tasks
  FOR EACH ROW EXECUTE FUNCTION log_task_complete();
