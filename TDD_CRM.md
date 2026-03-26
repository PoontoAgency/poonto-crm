# 📐 TDD — Poonto CRM

> Technical Design Document v1.0 — 26/03/2026
> Fonte di verità tecnica per lo sviluppo del CRM.

---

## 1. Panoramica

**Poonto CRM** è un CRM web multi-tenant per agenzie e PMI italiane.
- **Uso primario:** gestione interna clienti Poonto
- **Uso secondario:** fornito ai clienti Poonto come servizio
- **Uso terziario:** SaaS per altre agenzie italiane

**Differenziatori:** AI nativa, modello agenzia→clienti, prezzo flat, italiano-first.

---

## 2. Stack Tecnologico

| Layer | Tecnologia | Versione | Motivo |
|-------|-----------|----------|--------|
| **Frontend** | React + TypeScript | 19.x + 5.x | Ecosystem, performance, type safety |
| **Build** | Vite | 6.x | HMR istantaneo, ESM nativo |
| **Styling** | Tailwind CSS | 4.x | Design system rapido, dark mode |
| **State client** | Zustand | 5.x | Leggero, zero boilerplate |
| **State server** | TanStack Query | 5.x | Cache, refetch, optimistic updates |
| **Forms** | React Hook Form + Zod | 7.x + 4.x | Validazione type-safe |
| **UI primitivi** | Radix UI | latest | Accessibilità, headless |
| **Icons** | Lucide React | latest | Coerenza, tree-shakable |
| **Toast** | Sonner | latest | Minimale, elegante |
| **Charts** | Recharts | 2.x | React-native, responsive |
| **DnD** | @dnd-kit | latest | Kanban drag & drop |
| **Database** | Supabase (PostgreSQL) | latest | RLS, Auth, Realtime, Storage |
| **AI** | OpenAI GPT-4o / 4o-mini | latest | Riassunti, suggerimenti, draft |
| **Deploy frontend** | Vercel | — | Deploy automatico da GitHub |
| **CI/CD** | The Lair | v6 | Pipeline centralizzata Poonto |
| **DNS/CDN** | Cloudflare | — | Performance + protezione |

### Dipendenze `package.json`

```json
{
  "dependencies": {
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x",
    "@supabase/supabase-js": "^2.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^5.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^5.x",
    "zod": "^4.x",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-popover": "latest",
    "@radix-ui/react-tooltip": "latest",
    "@dnd-kit/core": "latest",
    "@dnd-kit/sortable": "latest",
    "lucide-react": "latest",
    "sonner": "latest",
    "recharts": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^3.x",
    "date-fns": "^3.x"
  },
  "devDependencies": {
    "vite": "^8.x",
    "@vitejs/plugin-react": "^6.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "typescript": "~5.9",
    "eslint": "^9.x"
  }
}
```

---

## 3. Architettura

### 3.1 Struttura cartelle

```
TESTPoonto/
├── CLAUDE.md                    # Regole progetto
├── BUSINESS_PLAN.md             # Business plan
├── PROGETTO_FUNZIONALITA.md     # Spec funzionale
├── TDD_CRM.md                  # QUESTO FILE
├── TASK_BREAKDOWN.md            # Checklist operativa
├── .env.example
├── .gitignore
├── vercel.json
├── src/
│   ├── app/
│   │   ├── main.tsx             # Entry point + providers
│   │   ├── App.tsx              # Router
│   │   └── providers.tsx        # QueryClient, Toaster
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx    # Layout protetto (auth guard + sidebar + header)
│   │   │   ├── Sidebar.tsx      # Nav laterale con workspace switcher
│   │   │   ├── Header.tsx       # Barra superiore con search + avatar
│   │   │   └── MobileNav.tsx    # Bottom nav mobile
│   │   └── ui/                  # Componenti riusabili
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx        # Wrapper Radix Dialog
│   │       ├── ConfirmDialog.tsx
│   │       ├── DataTable.tsx    # Tabella sortable/filterable
│   │       ├── EmptyState.tsx
│   │       ├── Spinner.tsx
│   │       ├── Avatar.tsx
│   │       ├── CommandPalette.tsx  # ⌘K search
│   │       └── ErrorBoundary.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── authService.ts
│   │   │   └── useAuth.ts
│   │   ├── onboarding/
│   │   │   └── OnboardingWizard.tsx  # 3 step
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AiBriefing.tsx
│   │   │   ├── KpiCards.tsx
│   │   │   ├── PipelineChart.tsx
│   │   │   ├── TasksToday.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── dashboardService.ts
│   │   │   └── dashboard.css
│   │   ├── contacts/
│   │   │   ├── ContactsPage.tsx      # Lista + filtri
│   │   │   ├── ContactDetail.tsx     # Scheda con timeline + AI sidebar
│   │   │   ├── ContactForm.tsx       # Crea/modifica
│   │   │   ├── ContactImport.tsx     # Import CSV/Excel
│   │   │   ├── Timeline.tsx          # Timeline unificata
│   │   │   ├── contactService.ts
│   │   │   ├── useContacts.ts
│   │   │   └── contacts.css
│   │   ├── pipeline/
│   │   │   ├── PipelinePage.tsx      # Board Kanban
│   │   │   ├── KanbanBoard.tsx       # Colonne + DnD
│   │   │   ├── DealCard.tsx          # Card dentro kanban
│   │   │   ├── DealSlideOver.tsx     # Dettaglio deal (pannello laterale)
│   │   │   ├── DealForm.tsx
│   │   │   ├── pipelineService.ts
│   │   │   ├── usePipeline.ts
│   │   │   └── pipeline.css
│   │   ├── tasks/
│   │   │   ├── TasksPage.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── taskService.ts
│   │   │   ├── useTasks.ts
│   │   │   └── tasks.css
│   │   ├── ai/
│   │   │   ├── AiSidebar.tsx         # Sidebar AI nella scheda contatto
│   │   │   ├── AiCompose.tsx         # Composer email/nota con AI
│   │   │   └── aiService.ts          # Chiamate OpenAI via Edge Function
│   │   ├── workspaces/
│   │   │   ├── WorkspacesPage.tsx    # Lista workspace (solo agency)
│   │   │   ├── WorkspaceForm.tsx
│   │   │   ├── WorkspaceSwitcher.tsx # Dropdown nel sidebar
│   │   │   ├── workspaceService.ts
│   │   │   └── useWorkspaces.ts
│   │   └── settings/
│   │       ├── SettingsPage.tsx
│   │       ├── TeamSettings.tsx
│   │       ├── PipelineSettings.tsx
│   │       ├── CustomFieldsSettings.tsx
│   │       ├── NotificationSettings.tsx
│   │       ├── settingsService.ts
│   │       ├── useSettings.ts
│   │       └── settings.css
│   ├── lib/
│   │   ├── supabase.ts           # Client Supabase
│   │   ├── queryClient.ts        # TanStack Query config
│   │   └── utils.ts              # cn(), formatDate(), formatCurrency()
│   ├── store/
│   │   ├── authStore.ts          # User + workspace corrente
│   │   └── uiStore.ts            # Sidebar open/close, modals
│   ├── types/
│   │   └── index.ts              # Tutti i tipi TS (corrispondono allo schema DB)
│   └── index.css                 # Design system Tailwind
└── supabase/
    └── migrations/
        ├── 001_schema.sql        # Tabelle principali
        ├── 002_rls.sql           # Row Level Security
        ├── 003_triggers.sql      # updated_at, stats, seed
        ├── 004_indexes.sql       # Indici performance
        └── 005_edge_functions.sql # Funzioni AI
```

### 3.2 Pattern architetturale per feature

Ogni feature segue lo stesso pattern a 4 livelli:

```
Service (supabase queries) → Hook (TanStack Query) → Page/Component (React) → CSS
```

**Esempio: contacts**
```
contactService.ts    → getContacts(), createContact(), updateContact()
useContacts.ts       → useContacts(), useContactDetail(), useCreateContact()
ContactsPage.tsx     → Usa hooks, renderizza UI
contacts.css         → Stili specifici feature
```

### 3.3 State management

| Tipo stato | Dove vive | Tool |
|-----------|-----------|------|
| Dati server (contatti, deal, task) | Supabase → cache TanStack Query | `useQuery` / `useMutation` |
| Auth (user, workspace) | Zustand `authStore` | `useAuthStore` |
| UI locale (sidebar, modals) | Zustand `uiStore` | `useUiStore` |
| Form temporaneo | React Hook Form | `useForm` |

---

## 4. Schema Database

### 4.1 Tabelle

#### `workspaces` — Tenant principale
```sql
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
```

#### `workspace_members` — Utenti nel workspace
```sql
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
```

#### `contacts` — Contatti/clienti
```sql
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
```

#### `pipelines` — Pipeline vendite
```sql
CREATE TABLE pipelines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Vendite',
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `pipeline_stages` — Stadi della pipeline
```sql
CREATE TABLE pipeline_stages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id     UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  position        INTEGER NOT NULL,
  probability     INTEGER NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  color           TEXT NOT NULL DEFAULT '#6B7280',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `deals` — Opportunità commerciali
```sql
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
```

#### `tasks` — Attività e follow-up
```sql
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
```

#### `activities` — Timeline unificata
```sql
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
```

#### `attachments` — File allegati
```sql
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
```

#### `custom_field_defs` — Definizione campi custom
```sql
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
```

#### `ai_cache` — Cache risultati AI
```sql
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
```

**Totale: 10 tabelle**

### 4.2 Row Level Security

Pattern: ogni tabella filtra per `workspace_id` controllando la membership dell'utente.

```sql
-- Funzione helper per i workspace dell'utente
CREATE OR REPLACE FUNCTION user_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT workspace_id FROM workspace_members
  WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Funzione per workspace agenzia (include sotto-workspace)
CREATE OR REPLACE FUNCTION user_all_workspace_ids()
RETURNS SETOF UUID AS $$
  SELECT id FROM workspaces
  WHERE id IN (SELECT user_workspace_ids())
     OR parent_workspace_id IN (SELECT user_workspace_ids())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Pattern RLS (applicato a tutte le tabelle con workspace_id)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_workspace" ON contacts FOR ALL
  USING (workspace_id IN (SELECT user_all_workspace_ids()));
-- Ripetuto per: deals, tasks, activities, attachments, pipelines, etc.
```

### 4.3 Triggers

```sql
-- 1. Auto-update updated_at (su tutte le tabelle con updated_at)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- Applicato a: workspaces, contacts, deals, tasks

-- 2. Seed default pipeline per nuovo workspace
CREATE OR REPLACE FUNCTION seed_new_workspace()
RETURNS TRIGGER AS $$
DECLARE v_pipeline_id UUID;
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
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_seed_workspace AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION seed_new_workspace();

-- 3. Log attività su spostamento deal
CREATE OR REPLACE FUNCTION log_deal_move()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
    INSERT INTO activities (workspace_id, contact_id, deal_id, type, content, metadata, created_by)
    VALUES (NEW.workspace_id, NEW.contact_id, NEW.id, 'deal_move',
      'Deal spostato', jsonb_build_object(
        'from_stage', OLD.stage_id, 'to_stage', NEW.stage_id
      ), auth.uid());
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_deal_move AFTER UPDATE OF stage_id ON deals
  FOR EACH ROW EXECUTE FUNCTION log_deal_move();
```

### 4.4 Indici

```sql
CREATE INDEX idx_contacts_workspace    ON contacts(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_search       ON contacts(workspace_id, first_name, last_name);
CREATE INDEX idx_contacts_email        ON contacts(workspace_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_tags         ON contacts USING GIN(tags);
CREATE INDEX idx_deals_workspace       ON deals(workspace_id);
CREATE INDEX idx_deals_pipeline_stage  ON deals(pipeline_id, stage_id) WHERE status = 'open';
CREATE INDEX idx_deals_contact         ON deals(contact_id);
CREATE INDEX idx_tasks_workspace       ON tasks(workspace_id);
CREATE INDEX idx_tasks_due             ON tasks(workspace_id, due_date) WHERE completed_at IS NULL;
CREATE INDEX idx_tasks_assigned        ON tasks(assigned_to, due_date) WHERE completed_at IS NULL;
CREATE INDEX idx_activities_contact    ON activities(contact_id, created_at DESC);
CREATE INDEX idx_activities_workspace  ON activities(workspace_id, created_at DESC);
CREATE INDEX idx_members_user          ON workspace_members(user_id);
CREATE INDEX idx_ai_cache_entity       ON ai_cache(entity_type, entity_id, ai_type);
```

---

## 5. Routing

```typescript
// App.tsx
<Routes>
  {/* Pubbliche */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/onboarding" element={<OnboardingWizard />} />

  {/* Protette */}
  <Route element={<AppLayout />}>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/contacts" element={<ContactsPage />} />
    <Route path="/contacts/:id" element={<ContactDetail />} />
    <Route path="/contacts/import" element={<ContactImport />} />
    <Route path="/pipeline" element={<PipelinePage />} />
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/workspaces" element={<WorkspacesPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/settings/team" element={<TeamSettings />} />
    <Route path="/settings/pipeline" element={<PipelineSettings />} />
    <Route path="/settings/fields" element={<CustomFieldsSettings />} />
  </Route>
</Routes>
```

---

## 6. Design System

### 6.1 Tema (index.css)

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@theme {
  --color-primary: #E05A3A;
  --color-primary-light: #FEE2D9;
  --color-primary-dark: #C94E30;
  --color-bg: #0F0F0F;
  --color-surface: #1A1A1A;
  --color-surface-hover: #252525;
  --color-border: #2A2A2A;
  --color-text: #F0F0F0;
  --color-text-secondary: #8A8A8A;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
}

html { font-family: 'Inter', system-ui, sans-serif; }
body { background: var(--color-bg); color: var(--color-text); }
```

### 6.2 Dark mode di default
Il CRM è **dark mode di default** (professionale, moderno).
Light mode disponibile come toggle in settings (fase 2).

---

## 7. AI Architecture

### 7.1 Supabase Edge Functions

L'AI non gira nel frontend. Le chiamate OpenAI passano da Edge Functions Supabase:

```
Frontend → supabase.functions.invoke('ai-summary', { contactId }) → Edge Function → OpenAI → risposta
```

**Edge Functions da creare:**

| Nome | Input | Output | Modello |
|------|-------|--------|---------|
| `ai-summary` | contactId | Riassunto 3-5 righe | gpt-4o-mini |
| `ai-score` | contactId | hot/warm/cold + motivo | gpt-4o-mini |
| `ai-suggest` | contactId | Array suggerimenti azione | gpt-4o-mini |
| `ai-compose` | contactId, scopo, tono | Draft email/nota | gpt-4o |
| `ai-briefing` | workspaceId | Morning briefing | gpt-4o-mini |

### 7.2 Context per AI

Ogni chiamata AI include nel prompt:
- Dati contatto (nome, azienda, posizione)
- Ultime 20 attività dalla timeline
- Deal aperti collegati
- Task aperti collegati
- Settings workspace (lingua, tono)

### 7.3 Cache

I risultati AI sono cachati in `ai_cache` con TTL 24h.
Invalidazione: quando viene aggiunta un'attività al contatto.

---

## 8. Auth Flow

```
Register → Supabase Auth signup → trigger seed_profile → Onboarding Wizard
  → Step 1: nome azienda + settore
  → Step 2: import contatti (CSV) o skip
  → Step 3: logo + colore
  → Crea workspace → seed pipeline + stadi default → Dashboard
```

**Guard:** `AppLayout` controlla:
1. `user` esiste → se no, redirect `/login`
2. Workspace esiste e onboarding completo → se no, redirect `/onboarding`

---

## 9. Configurazione ambiente

### `.env.example`
```env
# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_URL=http://localhost:5173
```

### `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 10. Convenzioni di codice

| Regola | Dettaglio |
|--------|-----------|
| File componenti | `PascalCase.tsx` |
| File servizi/hook | `camelCase.ts` |
| Tabelle DB | `snake_case` plurale |
| Colonne DB | `snake_case` |
| CSS per feature | `feature-name.css` in cartella feature |
| Branch Git | `feature/xxx`, `fix/xxx` |
| Commit | `feat(contacts): add import CSV` |
| Nessun `any` | TypeScript strict mode |
| Nessun secret nel codice | Solo `.env`, mai committato |

---

## 11. Performance target

| Metrica | Target |
|---------|--------|
| FCP | < 1.2s |
| TTI | < 2.0s |
| Lighthouse | > 90 |
| API lista contatti | < 200ms |
| AI riassunto | < 3s |
| Kanban drag | 60fps |
| Ricerca globale | < 100ms |
| Bundle size | < 300KB gzipped |

---

## 12. Piano di verifica

### Test automatici
```bash
# Lint + typecheck
npm run lint && npm run typecheck

# Build (verifica che compila senza errori)
npm run build
```

### Test manuali (per milestone)
1. **Auth:** registra utente → onboarding → login → logout → login di nuovo
2. **Contatti:** crea → modifica → cerca → filtra per tag → elimina (soft)
3. **Pipeline:** crea deal → drag tra stadi → verifica log in timeline contatto
4. **Task:** crea con scadenza → verifica in dashboard "oggi" → completa
5. **AI:** apri scheda contatto → verifica riassunto → genera draft email
6. **Multi-tenant:** crea workspace figlio → switch → verifica isolamento dati
7. **Mobile:** resize < 768px → verifica bottom nav, responsive tabella, DnD touch

---

> **Prossimo step:** TASK_BREAKDOWN.md → Implementazione milestone per milestone.
