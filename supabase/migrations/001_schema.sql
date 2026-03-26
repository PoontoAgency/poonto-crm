-- ============================================================
-- MIGRAZIONE 001 — Schema Poonto CRM v1.0
-- 10 tabelle principali
-- ============================================================

-- 1. Workspace (tenant principale)
CREATE TABLE workspaces (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  logo_url            TEXT,
  primary_color       TEXT DEFAULT '#E05A3A',
  owner_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  plan                TEXT NOT NULL DEFAULT 'free'
                      CHECK (plan IN ('free','starter','agency','scale')),
  plan_expires_at     TIMESTAMPTZ,
  settings            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Membri workspace
CREATE TABLE workspace_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'member'
                  CHECK (role IN ('owner','admin','member','viewer')),
  invited_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at     TIMESTAMPTZ,
  UNIQUE(workspace_id, user_id)
);

-- 3. Contatti
CREATE TABLE contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT,
  email           TEXT,
  phone           TEXT,
  company         TEXT,
  position        TEXT,
  address         TEXT,
  city            TEXT,
  province        TEXT,
  zip_code        TEXT,
  avatar_url      TEXT,
  tags            TEXT[] DEFAULT '{}',
  source          TEXT,
  ai_score        TEXT DEFAULT 'unknown'
                  CHECK (ai_score IN ('hot','warm','cold','unknown')),
  ai_summary      TEXT,
  ai_updated_at   TIMESTAMPTZ,
  custom_fields   JSONB DEFAULT '{}',
  owner_id        UUID REFERENCES auth.users(id),
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

-- 4. Pipeline
CREATE TABLE pipelines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Vendite',
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Stadi pipeline
CREATE TABLE pipeline_stages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id     UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  position        INTEGER NOT NULL,
  probability     INTEGER NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  color           TEXT NOT NULL DEFAULT '#6B7280',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Deal (opportunità)
CREATE TABLE deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  pipeline_id         UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_id            UUID NOT NULL REFERENCES pipeline_stages(id),
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  value               DECIMAL(12,2) DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'EUR',
  expected_close_date DATE,
  owner_id            UUID REFERENCES auth.users(id),
  status              TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open','won','lost')),
  lost_reason         TEXT,
  custom_fields       JSONB DEFAULT '{}',
  position            INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Task
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  contact_id      UUID REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id         UUID REFERENCES deals(id) ON DELETE SET NULL,
  due_date        DATE,
  due_time        TIME,
  priority        TEXT NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('high','medium','low')),
  assigned_to     UUID REFERENCES auth.users(id),
  completed_at    TIMESTAMPTZ,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Attività (timeline unificata)
CREATE TABLE activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id      UUID REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id         UUID REFERENCES deals(id) ON DELETE SET NULL,
  type            TEXT NOT NULL
                  CHECK (type IN ('note','email','call','meeting','deal_move',
                                  'task_complete','file','ai_insight','system')),
  content         TEXT,
  metadata        JSONB DEFAULT '{}',
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Allegati
CREATE TABLE attachments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('contact','deal','task')),
  entity_id       UUID NOT NULL,
  file_name       TEXT NOT NULL,
  file_url        TEXT NOT NULL,
  file_size       BIGINT,
  mime_type       TEXT,
  uploaded_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Definizione campi custom
CREATE TABLE custom_field_defs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('contact','deal','task')),
  field_name      TEXT NOT NULL,
  field_label     TEXT NOT NULL,
  field_type      TEXT NOT NULL CHECK (field_type IN ('text','number','date',
                                       'select','multiselect','checkbox','url')),
  options         JSONB,
  position        INTEGER NOT NULL DEFAULT 0,
  required        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Cache AI
CREATE TABLE ai_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL,
  entity_id       UUID NOT NULL,
  ai_type         TEXT NOT NULL CHECK (ai_type IN ('summary','score','suggestion','draft')),
  content         TEXT NOT NULL,
  model           TEXT NOT NULL,
  tokens_used     INTEGER,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, ai_type)
);
