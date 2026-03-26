# 🧩 POONTO CRM — Progetto Funzionalità

> Versione 1.0 — 26/03/2026
> Documento di dettaglio: ogni funzione, ogni schermata, ogni flusso.

---

## Architettura a livelli

```
┌─────────────────────────────────────────────────┐
│                    UTENTI                        │
│  Agenzia Poonto  │  Clienti Poonto  │  SaaS     │
└────────┬─────────┴────────┬─────────┴────┬──────┘
         │                  │              │
         ▼                  ▼              ▼
┌─────────────────────────────────────────────────┐
│              WORKSPACE (multi-tenant)            │
│  Ogni agenzia/azienda ha il suo workspace       │
│  isolato con dati, utenti e impostazioni propri  │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│                  MODULI                          │
│  Contatti │ Pipeline │ Attività │ AI │ Dashboard │
└─────────────────────────────────────────────────┘
```

---

## 1. 🔐 AUTENTICAZIONE & ONBOARDING

### 1.1 Registrazione

**Flusso:**
```
Landing page → "Prova gratis" → Email + Password → Conferma email → Onboarding wizard
```

**Onboarding wizard (3 step, max 2 minuti):**

| Step | Cosa chiede | Perché |
|------|-------------|--------|
| 1. Chi sei | Nome azienda, settore (dropdown), n° dipendenti | Personalizzazione AI e dashboard |
| 2. Importa contatti | CSV upload OPPURE "Inizio da zero" | Valore immediato — non partire vuoto |
| 3. Personalizza | Logo azienda, colore primario | Il CRM sembra subito "tuo" |

**Dopo l'onboarding:** redirect a dashboard con tour guidato interattivo (3 tooltip: "Ecco i tuoi contatti", "Ecco la pipeline", "Ecco l'AI").

### 1.2 Login

- Email + password (Supabase Auth)
- Magic link (login senza password via email)
- Google OAuth (fase 2)
- Remember me (30 giorni)
- Reset password

### 1.3 Multi-tenant

- Ogni registrazione crea un **workspace** isolato
- **Agenzia** (piano Agency/Scale): crea sotto-workspace per i propri clienti
- RLS Supabase: nessun dato attraversa i confini del workspace
- Ruoli: `owner` → `admin` → `member` → `viewer`

---

## 2. 👥 CONTATTI

> Il cuore del CRM. Ogni interazione con un cliente parte e finisce qui.

### 2.1 Lista contatti

**Schermata:** tabella responsive con:

| Colonna | Tipo | Ordinabile | Filtrabile |
|---------|------|------------|------------|
| Avatar + Nome | Testo | ✅ | ✅ ricerca |
| Azienda | Testo | ✅ | ✅ |
| Email | Email (cliccabile) | ✅ | ✅ |
| Telefono | Tel (cliccabile) | ✅ | ✅ |
| Tag | Badge colorati | ❌ | ✅ multi-select |
| Ultimo contatto | Data relativa ("3 giorni fa") | ✅ | ✅ range |
| Valore | €, sommato dai deal | ✅ | ✅ range |
| Score AI | 🔴🟡🟢 (freddo/tiepido/caldo) | ✅ | ✅ |

**Azioni massa:** seleziona multipli → tag, assegna, esporta, elimina.

**Vista alternativa:** griglia con card (toggle lista/griglia).

### 2.2 Scheda contatto

**Layout:** sidebar sinistra (info) + area centrale (timeline) + sidebar destra (AI)

#### Sidebar sinistra — Info
```
┌──────────────────┐
│    [Avatar]       │
│  Marco Rossi      │
│  CEO @ TechSrl    │
│                   │
│  📧 marco@techsrl.it
│  📱 +39 333 1234567
│  🏢 Via Roma 1, MI │
│                   │
│  Tag: [cliente] [premium]
│  Owner: Stefano   │
│  Creato: 15/03/26 │
│                   │
│  [✏️ Modifica]     │
└──────────────────┘
```

#### Area centrale — Timeline

Cronologia unificata di TUTTO ciò che è successo con questo contatto:

| Tipo evento | Icona | Esempio |
|------------|-------|---------|
| Nota | 📝 | "Chiamato, interessato al piano Pro" |
| Email | ✉️ | "Inviata proposta commerciale" |
| Chiamata | 📞 | "Durata 12 min — discusso pricing" |
| Deal | 💰 | "Deal 'Sito web TechSrl' spostato in Negoziazione" |
| Task | ✅ | "Task 'Inviare preventivo' completato" |
| Documento | 📎 | "Allegato contratto_v2.pdf" |
| AI | 🤖 | "AI: questo contatto non viene contattato da 14 giorni" |

**Composizione rapida:** textarea sticky in fondo → scrivi nota, allega file, log chiamata (tutto inline, senza popup).

#### Sidebar destra — AI Assistant

```
┌──────────────────┐
│  🤖 AI Insights   │
│                   │
│  📊 Score: 🟢 Caldo│
│                   │
│  💡 Suggerimenti:  │
│  • Richiamalo oggi │
│    (ultimo contatto│
│    14 giorni fa)   │
│  • Ha 2 deal aperti│
│    per €4.500      │
│  • Tono: formale   │
│                   │
│  📝 Draft email:   │
│  [Genera email]    │
│                   │
│  📋 Riassunto:     │
│  "Marco è CEO di   │
│   TechSrl, cliente │
│   dal 2024. 3 deal │
│   chiusi per €12k. │
│   Preferisce email │
│   il martedì."     │
└──────────────────┘
```

### 2.3 Import contatti

**Formati supportati:** CSV, Excel (.xlsx), vCard (.vcf)

**Flusso import CSV:**
```
Upload file → Preview (prime 5 righe) → Mapping colonne (auto-detect + manuale) → Dedup check → Import → Report
```

**Dedup:** match su email O telefono. Se duplicate: mostra e chiedi "unisci / salta / crea duplicato".

### 2.4 Campi custom

- L'utente può aggiungere campi personalizzati al contatto
- Tipi: testo, numero, data, dropdown, checkbox, URL
- I campi custom appaiono nella scheda contatto e nei filtri

---

## 3. 💰 PIPELINE (Vendite)

> Kanban visuale per tracciare ogni opportunità di vendita.

### 3.1 Board Kanban

**Scherma:** colonne orizzontali, card draggabili

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  LEAD    │  │CONTATTATO│  │ PROPOSTA │  │NEGOZIAZ. │  │  CHIUSO  │
│          │  │          │  │          │  │          │  │          │
│ ┌──────┐ │  │ ┌──────┐ │  │ ┌──────┐ │  │          │  │ ┌──────┐ │
│ │TechSrl│ │  │ │ABCsrl│ │  │ │XYZspa│ │  │          │  │ │FooInc│ │
│ │€3.000 │ │  │ │€1.500│ │  │ │€8.000│ │  │          │  │ │€2.000│ │
│ │Stefano│ │  │ │Marco │ │  │ │Stefano│ │  │          │  │ │✅ Vinto│
│ └──────┘ │  │ └──────┘ │  │ └──────┘ │  │          │  │ └──────┘ │
│ ┌──────┐ │  │          │  │          │  │          │  │          │
│ │NewCo │ │  │          │  │          │  │          │  │          │
│ │€5.000 │ │  │          │  │          │  │          │  │          │
│ └──────┘ │  │          │  │          │  │          │  │          │
│          │  │          │  │          │  │          │  │          │
│ Tot:€8k  │  │ Tot:€1.5k│  │ Tot:€8k  │  │ Tot:€0   │  │ Tot:€2k  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
                        Pipeline totale: €19.500
```

**Interazioni:**
- **Drag & drop** card tra colonne
- **Click** sulla card → apre dettaglio deal (slide-over da destra)
- **+ Nuovo deal** → form rapido (nome, contatto, valore, stadio)
- **Filtri:** per owner, tag, valore min/max, data creazione

### 3.2 Deal (opportunità)

**Scheda deal (slide-over):**

| Campo | Tipo | Note |
|-------|------|------|
| Nome deal | Testo | "Sito web TechSrl" |
| Contatto | Link a contatto | Auto-collegato |
| Azienda | Testo | Ereditato dal contatto |
| Valore | € | €3.000 |
| Stadio | Dropdown/drag | Lead → Contattato → Proposta → Negoziazione → Chiuso (vinto/perso) |
| Probabilità | % | Auto-calcolata dallo stadio (20% → 40% → 60% → 80% → 100%) |
| Data chiusura prevista | Data | Per forecast |
| Owner | Membro team | Chi gestisce questo deal |
| Note | Textarea | Libero |
| File allegati | Upload | Preventivi, contratti |

**Automazione stadio:**
- Ogni spostamento logga nella timeline del contatto
- Se deal resta fermo > 7 giorni → notifica owner
- Se deal chiuso come "vinto" → crea task "Onboarding cliente"

### 3.3 Pipeline multiple

- Ogni workspace può avere più pipeline (es. "Vendite", "Partnership", "Rinnovi")
- Stadi personalizzabili per pipeline
- Switch rapido tra pipeline

---

## 4. ✅ ATTIVITÀ & TASK

> Mai più "me lo ero dimenticato". Ogni azione ha una scadenza e un reminder.

### 4.1 Lista task

**Schermata:** lista con filtri rapidi

```
┌─────────────────────────────────────────────────────┐
│  📋 Le mie attività          [Oggi] [Questa sett.] [Tutte]  │
│                                                       │
│  🔴 SCADUTE                                          │
│  ☐ Richiamare Marco Rossi (TechSrl)    📅 24/03      │
│  ☐ Inviare preventivo ABC Srl           📅 25/03      │
│                                                       │
│  🟡 OGGI                                             │
│  ☐ Follow-up proposta XYZ Spa          📅 26/03      │
│  ☐ Preparare presentazione Poonto       📅 26/03      │
│                                                       │
│  🟢 PROSSIMI                                         │
│  ☐ Riunione team settimanale            📅 28/03      │
│  ☐ Review contratto FooInc              📅 30/03      │
└─────────────────────────────────────────────────────┘
```

### 4.2 Creazione task

**Form rapido (inline, no popup):**

| Campo | Tipo | Obbligatorio |
|-------|------|-------------|
| Titolo | Testo | ✅ |
| Contatto collegato | Autocomplete | ❌ |
| Deal collegato | Autocomplete | ❌ |
| Scadenza | Date picker | ✅ |
| Priorità | Alta / Media / Bassa | Default: Media |
| Assegnato a | Membro team | Default: me stesso |
| Note | Testo | ❌ |

**Scorciatoie:**
- Dalla scheda contatto: "+" → task pre-collegato al contatto
- Dal deal: "+" → task pre-collegato al deal + contatto
- Da AI: "Crea follow-up" → task pre-compilato con suggerimento

### 4.3 Reminder

- **In-app:** badge rosso su icona attività + toast notification
- **Email:** reminder automatico 1 ora prima della scadenza
- **Telegram (fase 2):** notifica push

---

## 5. 🤖 AI ASSISTANT

> Il vero differenziatore. L'AI che lavora per te, non che ti fa lavorare di più.

### 5.1 AI per contatto

| Feature | Input | Output | Quando |
|---------|-------|--------|--------|
| **Riassunto** | Tutta la timeline del contatto | 3-5 righe: chi è, cosa fa, storia con noi, preferenze | On-demand + cache |
| **Score** | Frequenza contatti, deal aperti, risposte email | 🔴 Freddo / 🟡 Tiepido / 🟢 Caldo | Auto, aggiornato giornalmente |
| **Suggerimento azione** | Score + ultimo contatto + deal aperti | "Richiamalo", "Invia follow-up", "Proponi upsell" | Sempre visibile in sidebar |
| **Draft email** | Contesto contatto + scopo selezionato | Email pronta da inviare/modificare | On-demand |
| **Tono di voce** | Analisi storico comunicazioni | "Formale", "Amichevole", "Tecnico" | Auto |

### 5.2 AI globale (Dashboard)

| Feature | Cosa fa |
|---------|---------|
| **Morning briefing** | "Oggi hai 3 task, 2 deal caldi, Marco Rossi non risponde da 10 giorni" |
| **Forecast AI** | "Questo mese chiuderai probabilmente €12.000 (basato su deal e probabilità)" |
| **Alert anomalie** | "Il deal XYZ è fermo da 15 giorni — vuoi spostarlo o chiuderlo?" |
| **Suggerimenti globali** | "Hai 5 contatti senza follow-up da >30 giorni — vuoi creare task automatici?" |

### 5.3 AI Compose

**Da qualsiasi punto del CRM**, l'utente può aprire un composer AI:

```
┌─────────────────────────────────────┐
│  🤖 AI Compose                      │
│                                     │
│  Per: Marco Rossi (TechSrl)         │
│  Tipo: [Email ▾] [WhatsApp] [Nota]  │
│                                     │
│  Scopo: ___________________________│
│  (es. "follow-up proposta sito web")│
│                                     │
│  Tono: [Professionale ▾]           │
│                                     │
│  [🪄 Genera]                        │
│                                     │
│  ─── Output ───                     │
│  Gentile Marco,                     │
│  le scrivo per un aggiornamento...  │
│                                     │
│  [📋 Copia] [✏️ Modifica] [📧 Invia]│
└─────────────────────────────────────┘
```

### 5.4 Modello AI e costi

| Operazione | Modello | Costo stimato |
|-----------|---------|---------------|
| Riassunto contatto | GPT-4o mini | ~$0.001 |
| Score + suggerimento | GPT-4o mini | ~$0.001 |
| Draft email | GPT-4o | ~$0.005 |
| Morning briefing | GPT-4o mini | ~$0.002 |
| Forecast | Calcolo locale (no AI) | $0 |

**Costo medio per utente attivo:** ~$0.30/mese

---

## 6. 📊 DASHBOARD

> La prima cosa che vedi quando apri il CRM. Deve dare valore in 2 secondi.

### 6.1 Layout dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Buongiorno Stefano 👋                    26 marzo 2026  │
├──────────┬──────────┬──────────┬───────────────────────┤
│ Pipeline │ Deal     │ Task     │ Contatti              │
│ €19.500  │ 8 aperti │ 3 oggi   │ 47 attivi             │
│ +12% ▲   │ 2 caldi  │ 2 scaduti│ 5 nuovi questa sett.  │
├──────────┴──────────┴──────────┴───────────────────────┤
│                                                         │
│  🤖 AI Briefing                                         │
│  "Oggi hai 3 task da completare. Il deal TechSrl è      │
│   caldo — Marco ha aperto la proposta 2 volte ieri.     │
│   Suggerimento: chiamalo entro le 11."                  │
│                                                         │
├─────────────────────────┬───────────────────────────────┤
│  📈 Pipeline (grafico)   │  📋 Task di oggi              │
│                         │                               │
│  ██████░░░░  €19.5k     │  ☐ Richiamare Marco           │
│  Lead: €8k              │  ☐ Follow-up XYZ              │
│  Proposta: €8k          │  ☐ Preparare deck              │
│  Negoziaz: €0           │                               │
│  Chiuso: €3.5k          │                               │
├─────────────────────────┴───────────────────────────────┤
│  🕐 Attività recenti                                    │
│  • Stefano ha chiuso deal FooInc (€2.000) — 2h fa      │
│  • Marco ha aggiunto nota su TechSrl — ieri             │
│  • AI: 3 contatti senza follow-up da >14 giorni         │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Widget personalizzabili (fase 2)

L'utente trascina e riordina i widget. Widget disponibili:
- KPI cards (pipeline, deal, task, contatti)
- Grafico pipeline (bar chart)
- Grafico conversioni (funnel)
- Task di oggi
- Attività recenti del team
- AI briefing
- Calendario (mini)

---

## 7. 🏢 MULTI-TENANT (Modello Agenzia)

> Il differenziatore chiave. L'agenzia gestisce i CRM dei propri clienti.

### 7.1 Gerarchia

```
Poonto (Agenzia)                    ← Piano Agency/Scale
├── Workspace Poonto (interno)      ← CRM dell'agenzia
├── Workspace TechSrl               ← CRM del cliente 1
├── Workspace ABC Srl               ← CRM del cliente 2
└── Workspace XYZ Spa               ← CRM del cliente 3
```

### 7.2 Permessi

| Ruolo | Vede | Fa |
|-------|------|----|
| **Agenzia Owner** | Tutti i workspace | Crea/elimina workspace, gestisce utenti, vede tutto |
| **Agenzia Admin** | Workspace assegnati | Gestisce contatti/deal/task nei workspace assegnati |
| **Cliente Owner** | Solo il suo workspace | Gestisce il proprio CRM, invita suoi utenti |
| **Cliente Member** | Solo il suo workspace | Usa il CRM (contatti, deal, task) |
| **Viewer** | Solo il suo workspace | Sola lettura |

### 7.3 Switch workspace

Header della dashboard:
```
┌─────────────────────────────────────────┐
│  [🏢 Poonto ▾]  Dashboard  Contatti  ...│
│                                         │
│  ▾ Switch workspace:                    │
│    ✅ Poonto (interno)                   │
│    ○ TechSrl                            │
│    ○ ABC Srl                            │
│    ○ XYZ Spa                            │
│    + Crea nuovo workspace               │
└─────────────────────────────────────────┘
```

### 7.4 Creazione workspace cliente

**Flusso (per l'agenzia):**
```
"+ Crea workspace" → Nome azienda + Logo → Invita owner cliente (email) → Workspace attivo
```

Il cliente riceve un'email: "Poonto ti ha attivato il CRM. Accedi qui."

---

## 8. ⚙️ IMPOSTAZIONI

### 8.1 Profilo azienda

| Campo | Tipo |
|-------|------|
| Nome azienda | Testo |
| Logo | Upload immagine |
| Colore primario | Color picker |
| Indirizzo | Testo |
| P.IVA | Testo |
| Email aziendale | Email |
| Telefono | Tel |

### 8.2 Team & utenti

- Invita utente (via email)
- Assegna ruolo (owner/admin/member/viewer)
- Disattiva/riattiva utente
- Log accessi

### 8.3 Pipeline personalizzata

- Crea/rinomina/riordina stadi
- Imposta probabilità per stadio
- Crea pipeline multiple

### 8.4 Campi custom

- Aggiungi campi a contatti, deal, task
- Tipi: testo, numero, data, dropdown, checkbox, URL
- Ordina e raggruppa

### 8.5 Integrazioni (fase 2)

| Integrazione | Cosa fa |
|-------------|---------|
| Email (IMAP/SMTP) | Invia/ricevi email dal CRM |
| WhatsApp Business | Chat integrata |
| Google Calendar | Sync eventi/appuntamenti |
| Telegram | Notifiche + bot gestione |

### 8.6 Notifiche

| Evento | In-app | Email | Telegram |
|--------|--------|-------|----------|
| Task scaduto | ✅ | ✅ | Fase 2 |
| Deal spostato | ✅ | ❌ | Fase 2 |
| Nuovo contatto (import) | ✅ | ❌ | ❌ |
| AI alert | ✅ | ✅ (daily digest) | Fase 2 |
| Invitato al workspace | ✅ | ✅ | ❌ |

---

## 9. 📱 RESPONSIVE & MOBILE

> La maggior parte delle PMI italiane lavora da telefono. Il CRM deve funzionare perfettamente su mobile.

### 9.1 Breakpoints

| Dispositivo | Breakpoint | Layout |
|-------------|-----------|--------|
| Desktop | >1024px | Sidebar + contenuto + sidebar AI |
| Tablet | 768-1024px | Sidebar collassata + contenuto |
| Mobile | <768px | Bottom nav + contenuto full-width |

### 9.2 Mobile-specific

- **Bottom navigation:** Dashboard, Contatti, Pipeline, Attività, Menu
- **Swipe:** su card contatto → azioni rapide (chiama, email, nota)
- **Tap-to-call:** numero telefono → apre chiamata
- **Camera:** scansiona biglietto da visita → crea contatto (AI, fase 2)
- **Voice note:** registra → trascrivi con Whisper → salva come nota (fase 2)

---

## 10. 🔍 RICERCA GLOBALE

**Command palette** (⌘K / Ctrl+K):

```
┌─────────────────────────────────────┐
│  🔍 Cerca qualsiasi cosa...         │
│                                     │
│  Contatti                           │
│  👤 Marco Rossi — TechSrl           │
│  👤 Maria Bianchi — ABC Srl         │
│                                     │
│  Deal                               │
│  💰 Sito web TechSrl — €3.000       │
│                                     │
│  Azioni rapide                      │
│  ➕ Nuovo contatto                   │
│  ➕ Nuovo deal                       │
│  📋 Le mie attività                  │
└─────────────────────────────────────┘
```

- Ricerca fuzzy su contatti, deal, aziende, note
- Risultati in tempo reale mentre digiti
- Azioni rapide sempre accessibili

---

## 11. 📤 EXPORT & REPORT

### 11.1 Export dati

| Dato | Formati | Chi può |
|------|---------|---------|
| Contatti | CSV, Excel | Admin+ |
| Deal | CSV, Excel | Admin+ |
| Report pipeline | PDF | Admin+ |

### 11.2 Report (fase 2)

- Report settimanale automatico (email)
- Report mensile PDF con KPI
- Report per workspace (agenzia vede tutti)
- Grafici: conversione per stadio, tempo medio chiusura, performance team

---

## 12. 🗄️ DATABASE — Schema

### Tabelle principali

```sql
-- Multi-tenant
workspaces (id, name, logo_url, color, owner_id, parent_workspace_id, plan, created_at)
workspace_members (workspace_id, user_id, role, invited_at, accepted_at)

-- Contatti
contacts (id, workspace_id, first_name, last_name, email, phone, company,
          position, address, avatar_url, tags, ai_score, ai_summary,
          custom_fields, created_by, created_at, updated_at)

-- Pipeline & Deal
pipelines (id, workspace_id, name, created_at)
pipeline_stages (id, pipeline_id, name, position, probability, color)
deals (id, workspace_id, pipeline_id, stage_id, contact_id, name, value,
       currency, expected_close_date, owner_id, status, custom_fields,
       created_at, updated_at)

-- Attività
tasks (id, workspace_id, title, description, contact_id, deal_id,
       due_date, priority, assigned_to, completed_at, created_at)

-- Timeline
activities (id, workspace_id, contact_id, deal_id, type, content,
            metadata, created_by, created_at)
-- type: note, email, call, deal_move, task_complete, file, ai_insight

-- File
attachments (id, workspace_id, entity_type, entity_id, file_name,
             file_url, file_size, uploaded_by, created_at)

-- AI
ai_cache (id, workspace_id, entity_type, entity_id, ai_type,
          content, model, tokens_used, expires_at, created_at)

-- Impostazioni
custom_fields (id, workspace_id, entity_type, field_name, field_type,
               options, position, required, created_at)
notification_settings (user_id, workspace_id, channel, event_type, enabled)
```

### RLS (Row Level Security)

Ogni tabella ha policy RLS:
```
workspace_id = current_user_workspace_id()
```

L'agenzia owner ha una policy aggiuntiva:
```
workspace_id IN (SELECT id FROM workspaces WHERE parent_workspace_id = agency_workspace_id)
```

---

## 13. 🗺️ MAPPA SCHERMATE

```
/login                     ← Login
/register                  ← Registrazione + onboarding wizard
/                          ← Dashboard (con AI briefing)
/contacts                  ← Lista contatti
/contacts/:id              ← Scheda contatto (timeline + AI)
/contacts/import           ← Import CSV/Excel
/pipeline                  ← Board Kanban pipeline
/pipeline/:id/deal/:dealId ← Dettaglio deal (slide-over)
/tasks                     ← Lista task / attività
/settings                  ← Impostazioni
/settings/team             ← Gestione team
/settings/pipeline         ← Config pipeline e stadi
/settings/fields           ← Campi custom
/settings/integrations     ← Integrazioni (fase 2)
/settings/notifications    ← Preferenze notifiche
/workspaces                ← Lista workspace (solo agenzia)
/workspaces/new            ← Crea workspace cliente
```

---

## 14. 🎨 DESIGN SYSTEM

### Colori

| Token | Valore | Uso |
|-------|--------|-----|
| `--primary` | `#E05A3A` | Arancione Poonto — CTA, link, accenti |
| `--primary-hover` | `#C94E30` | Hover su primary |
| `--bg` | `#0F0F0F` | Background scuro (dark mode default) |
| `--surface` | `#1A1A1A` | Card, sidebar |
| `--surface-hover` | `#252525` | Hover su surface |
| `--border` | `#2A2A2A` | Bordi sottili |
| `--text` | `#F0F0F0` | Testo primario |
| `--text-secondary` | `#8A8A8A` | Testo secondario |
| `--success` | `#22C55E` | Verde — deal vinto, task completato |
| `--warning` | `#F59E0B` | Giallo — attenzione |
| `--danger` | `#EF4444` | Rosso — errore, scaduto |

### Tipografia

| Uso | Font | Weight | Size |
|-----|------|--------|------|
| Heading H1 | Inter | 700 | 28px |
| Heading H2 | Inter | 600 | 22px |
| Heading H3 | Inter | 600 | 18px |
| Body | Inter | 400 | 14px |
| Caption | Inter | 400 | 12px |
| Badge | Inter | 500 | 11px |

### Componenti base

| Componente | Varianti |
|-----------|----------|
| Button | primary, secondary, ghost, danger |
| Input | text, email, tel, number, textarea |
| Select | single, multi, searchable |
| Badge | colori custom, removibile |
| Card | default, hoverable, selected |
| Modal | default, confirm (danger) |
| Toast | success, error, info, warning |
| Avatar | immagine, iniziali, placeholder |
| Table | sortable, filterable, selectable |
| Kanban | colonne, card draggabili |

---

## 15. ⚡ PERFORMANCE TARGET

| Metrica | Target |
|---------|--------|
| First Contentful Paint | < 1.2s |
| Time to Interactive | < 2.0s |
| Lighthouse Performance | > 90 |
| API response (lista contatti) | < 200ms |
| AI response (riassunto) | < 3s |
| Ricerca globale | < 100ms (debounced) |
| Kanban drag & drop | 60fps |

---

> **Prossimo passo:** Approvazione funzionalità → TDD tecnico → TASK_BREAKDOWN.md → Implementazione MVP.
