# ✅ TASK BREAKDOWN — Poonto CRM

> Checklist operativa. Seguire i task nell'ordine esatto.
> Non passare alla milestone successiva finché TUTTI i task della milestone corrente non sono `[x]`.

---

## M1 — Foundation (Setup progetto)

### M1.1 — Inizializzazione
- [ ] Creare progetto Vite + React + TypeScript in `TESTPoonto/`
- [ ] Installare tutte le dipendenze da TDD §2
- [ ] Configurare `tsconfig.json` (strict mode, paths alias `@/`)
- [ ] Configurare `eslint.config.js`
- [ ] Creare `.env.example` con variabili Supabase
- [ ] Creare `.gitignore`
- [ ] Creare `vercel.json` con rewrite SPA

### M1.2 — Design System
- [ ] Creare `src/index.css` con tema dark Poonto (TDD §6)
- [ ] Creare `src/lib/utils.ts` — `cn()`, `formatDate()`, `formatCurrency()`

### M1.3 — Componenti UI base
- [ ] `Button.tsx` — primary, secondary, ghost, danger, loading
- [ ] `Input.tsx` — text, email, tel, number, textarea, con label + error
- [ ] `Badge.tsx` — colori custom, removibile
- [ ] `Card.tsx` — default, hoverable
- [ ] `Modal.tsx` — wrapper Radix Dialog
- [ ] `ConfirmDialog.tsx` — "Sei sicuro?" con azione danger
- [ ] `Spinner.tsx` — spinner + FullPageSpinner
- [ ] `Avatar.tsx` — immagine, iniziali, placeholder
- [ ] `EmptyState.tsx` — icona + messaggio + CTA
- [ ] `ErrorBoundary.tsx`

### M1.4 — Layout
- [ ] `AppLayout.tsx` — guard auth + onboarding + sidebar + header + outlet
- [ ] `Sidebar.tsx` — navigazione con icone + workspace switcher placeholder
- [ ] `Header.tsx` — titolo pagina + search bar placeholder + avatar utente
- [ ] `MobileNav.tsx` — bottom navigation per < 768px
- [ ] Testare responsive: desktop, tablet, mobile

### M1.5 — Auth
- [ ] `src/lib/supabase.ts` — client Supabase
- [ ] `src/lib/queryClient.ts` — TanStack Query config
- [ ] `src/app/providers.tsx` — QueryClientProvider + Toaster
- [ ] `src/app/main.tsx` — entry point con providers
- [ ] `src/store/authStore.ts` — Zustand store (user, workspace, loading)
- [ ] `src/types/index.ts` — tutti i tipi TS (da TDD §4)
- [ ] `features/auth/authService.ts` — login, register, logout, getSession
- [ ] `features/auth/useAuth.ts` — hook con listener auth state
- [ ] `features/auth/LoginPage.tsx` — email + password + magic link
- [ ] `features/auth/RegisterPage.tsx` — email + password + conferma

### M1.6 — Database
- [ ] Creare progetto Supabase (o usare esistente)
- [ ] Eseguire `001_schema.sql` — 10 tabelle (da TDD §4.1)
- [ ] Eseguire `002_rls.sql` — RLS multi-tenant (da TDD §4.2)
- [ ] Eseguire `003_triggers.sql` — updated_at, seed workspace, log deal (da TDD §4.3)
- [ ] Eseguire `004_indexes.sql` — 14 indici (da TDD §4.4)
- [ ] Verificare: creare utente test → login → workspace creato automaticamente

### M1.7 — Onboarding
- [ ] `features/onboarding/OnboardingWizard.tsx` — 3 step:
  - Step 1: nome azienda + settore
  - Step 2: import contatti (CSV) o "Inizio da zero"
  - Step 3: logo + colore primario
- [ ] Al completamento: crea workspace → redirect a dashboard
- [ ] Testare: registra → onboarding → dashboard raggiunta

### M1.8 — Router
- [ ] `src/app/App.tsx` — tutte le route da TDD §5
- [ ] Placeholder pages per ogni route (titolo + "Coming soon")
- [ ] Verificare: navigazione sidebar → ogni pagina carica

### M1.9 — Verifica M1
- [ ] `npm run lint` — zero errori
- [ ] `npm run build` — build riuscita
- [ ] Auth flow completo: register → onboarding → dashboard → logout → login
- [ ] Responsive: desktop + mobile funzionanti
- [ ] Sidebar navigazione tutte le pagine

---

## M2 — Contatti

### M2.1 — Service & Hook
- [ ] `features/contacts/contactService.ts` — getContacts, getContact, createContact, updateContact, deleteContact (soft), importCSV
- [ ] `features/contacts/useContacts.ts` — useContacts (con search + filtri), useContactDetail, useCreateContact, useUpdateContact, useDeleteContact

### M2.2 — Lista contatti
- [ ] `features/contacts/ContactsPage.tsx`:
  - Tabella sortable con colonne: avatar+nome, azienda, email, telefono, tag, ultimo contatto, score AI
  - Barra ricerca con debounce
  - Filtri: per tag (multi-select), per score
  - Azioni massa: seleziona → tag, elimina
  - Pulsante "+ Nuovo contatto"
  - Toggle vista lista/griglia
- [ ] `features/contacts/contacts.css`

### M2.3 — Crea/Modifica contatto
- [ ] `features/contacts/ContactForm.tsx` — form con React Hook Form + Zod:
  - Nome, cognome, email, telefono, azienda, posizione, indirizzo, note
  - Tag (input multi con autocomplete)
  - Validazione: nome obbligatorio, email formato valido
  - Modalità: crea (modal) e modifica (stessa pagina)

### M2.4 — Scheda contatto
- [ ] `features/contacts/ContactDetail.tsx`:
  - Sidebar sinistra: info contatto + tag + owner + date
  - Area centrale: Timeline unificata (TDD §4 activities)
  - Sidebar destra: placeholder AI (completata in M5)
  - Composizione rapida: textarea + bottoni (nota, chiamata, email, file)
- [ ] `features/contacts/Timeline.tsx` — render cronologico attività

### M2.5 — Import contatti
- [ ] `features/contacts/ContactImport.tsx`:
  - Upload file CSV/Excel
  - Preview prime 5 righe
  - Mapping colonne (auto-detect + manuale)
  - Dedup check (match email o telefono)
  - Import con progress bar
  - Report risultato (importati / duplicati / errori)

### M2.6 — Verifica M2
- [ ] Creare 5 contatti manualmente
- [ ] Importare CSV con 10 contatti
- [ ] Cercare per nome — risultati corretti
- [ ] Filtrare per tag — risultati corretti
- [ ] Aprire scheda contatto — info + timeline vuota
- [ ] Aggiungere nota dalla scheda — appare in timeline
- [ ] Eliminare contatto (soft delete) — sparisce dalla lista
- [ ] Responsive mobile: lista + scheda funzionanti

---

## M3 — Pipeline

### M3.1 — Service & Hook
- [ ] `features/pipeline/pipelineService.ts` — getPipeline, getStages, getDeals, createDeal, updateDeal, moveDeal, deleteDeal
- [ ] `features/pipeline/usePipeline.ts` — usePipeline, useDeals, useCreateDeal, useUpdateDeal, useMoveDeal

### M3.2 — Board Kanban
- [ ] `features/pipeline/PipelinePage.tsx` — contenitore con header (titolo pipeline + filtri + "Nuovo deal")
- [ ] `features/pipeline/KanbanBoard.tsx`:
  - Colonne per ogni stadio con header (nome + conteggio + totale €)
  - Drag & drop con @dnd-kit (touch-friendly)
  - Scroll orizzontale su mobile
- [ ] `features/pipeline/DealCard.tsx`:
  - Nome deal, valore €, contatto, owner, data prevista
  - Click → apre DealSlideOver
- [ ] `features/pipeline/pipeline.css`

### M3.3 — Dettaglio deal
- [ ] `features/pipeline/DealSlideOver.tsx` — pannello laterale (slide da destra):
  - Tutti i campi del deal (nome, valore, stadio, contatto, owner, data, note)
  - Modifica inline
  - Log attività collegata (timeline filtrata per deal)
  - Pulsante "Vinto" / "Perso"
- [ ] `features/pipeline/DealForm.tsx` — form per nuovo deal (modal)

### M3.4 — Verifica M3
- [ ] Creare 3 deal in stadi diversi
- [ ] Drag & drop deal tra stadi — posizione aggiornata in DB
- [ ] Verificare che spostamento logga in timeline del contatto collegato
- [ ] Creare deal "Vinto" → status = won
- [ ] Totali per stadio corretti nella board
- [ ] Responsive mobile: scroll orizzontale, DnD touch

---

## M4 — Attività & Task

### M4.1 — Service & Hook
- [ ] `features/tasks/taskService.ts` — getTasks, createTask, updateTask, completeTask, deleteTask
- [ ] `features/tasks/useTasks.ts` — useTasks (filtri: oggi/settimana/tutti/scaduti), useCreateTask, useCompleteTask

### M4.2 — Pagina task
- [ ] `features/tasks/TasksPage.tsx`:
  - Filtri rapidi: Oggi, Questa settimana, Tutti, Scaduti
  - Lista raggruppata: 🔴 Scaduti, 🟡 Oggi, 🟢 Prossimi
  - Checkbox per completare
  - Link a contatto/deal collegato
- [ ] `features/tasks/TaskForm.tsx` — form inline o modal:
  - Titolo, scadenza, priorità, assegnato a, contatto, deal, note
- [ ] `features/tasks/tasks.css`

### M4.3 — Integrazione con contatti e deal
- [ ] Nella scheda contatto: sezione "Task aperti" + bottone "+ Task"
- [ ] Nel deal slide-over: sezione "Task aperti" + bottone "+ Task"
- [ ] Completamento task → log in timeline contatto

### M4.4 — Verifica M4
- [ ] Creare 3 task con scadenze diverse (ieri, oggi, domani)
- [ ] Filtro "Scaduti" — mostra solo quello di ieri
- [ ] Filtro "Oggi" — mostra quello di oggi
- [ ] Completare task → sparisce dalla lista, appare in timeline contatto
- [ ] Creare task dalla scheda contatto → pre-collegato

---

## M5 — AI & Dashboard

### M5.1 — Dashboard
- [ ] `features/dashboard/DashboardPage.tsx` — layout griglia
- [ ] `features/dashboard/KpiCards.tsx` — 4 card: pipeline totale, deal aperti, task oggi, contatti attivi
- [ ] `features/dashboard/PipelineChart.tsx` — bar chart stadi con Recharts
- [ ] `features/dashboard/TasksToday.tsx` — lista task di oggi (max 5)
- [ ] `features/dashboard/RecentActivity.tsx` — ultime 10 attività del workspace
- [ ] `features/dashboard/dashboardService.ts` — query aggregate per KPI
- [ ] `features/dashboard/dashboard.css`

### M5.2 — AI Assistant
- [ ] `features/ai/aiService.ts` — chiamate a Edge Functions (o call diretta OpenAI via proxy)
- [ ] `features/ai/AiSidebar.tsx` — sidebar nella scheda contatto:
  - Score (hot/warm/cold con badge colorato)
  - Riassunto (3-5 righe)
  - Suggerimenti azione (lista)
  - Bottone "Genera email"
- [ ] `features/ai/AiCompose.tsx` — composer per draft email/nota:
  - Seleziona contatto, scopo, tono
  - Genera → modifica → copia/invia
- [ ] `features/dashboard/AiBriefing.tsx` — card "Morning briefing" nella dashboard

### M5.3 — Verifica M5
- [ ] Dashboard mostra KPI corretti (contatti, deal, task)
- [ ] Grafico pipeline con dati reali
- [ ] AI sidebar mostra riassunto su contatto con storico
- [ ] AI compose genera email coerente con contesto
- [ ] Morning briefing nella dashboard

---

## M6 — Multi-tenant (Workspace)

### M6.1 — Service & Hook
- [ ] `features/workspaces/workspaceService.ts` — getWorkspaces, createWorkspace, switchWorkspace, inviteMember
- [ ] `features/workspaces/useWorkspaces.ts`

### M6.2 — UI Workspace
- [ ] `features/workspaces/WorkspaceSwitcher.tsx` — dropdown nel sidebar (lista workspace + "Crea nuovo")
- [ ] `features/workspaces/WorkspacesPage.tsx` — lista tutti i workspace (solo agenzia)
- [ ] `features/workspaces/WorkspaceForm.tsx` — crea workspace figlio (nome, logo, invita owner)
- [ ] Aggiornare `authStore` — workspace corrente selezionato
- [ ] Aggiornare tutti i service — filtrano per workspace corrente

### M6.3 — Verifica M6
- [ ] Creare workspace figlio
- [ ] Switch tra workspace — dati diversi
- [ ] Verificare isolamento RLS: workspace A non vede dati workspace B
- [ ] Agenzia owner vede tutti i workspace figli

---

## M7 — Settings & Polish

### M7.1 — Settings
- [ ] `features/settings/SettingsPage.tsx` — profilo azienda (nome, logo, colore)
- [ ] `features/settings/TeamSettings.tsx` — lista utenti + invita + cambia ruolo
- [ ] `features/settings/PipelineSettings.tsx` — crea/rinomina/riordina stadi
- [ ] `features/settings/CustomFieldsSettings.tsx` — aggiungi campi custom a contatti/deal
- [ ] `features/settings/NotificationSettings.tsx` — toggle per tipo di notifica

### M7.2 — Command Palette
- [ ] `components/ui/CommandPalette.tsx` — ⌘K / Ctrl+K
  - Ricerca fuzzy contatti, deal, azioni rapide
  - Risultati in tempo reale

### M7.3 — Polish
- [ ] Animazioni: slide sidebar, fade modal, transition card hover
- [ ] Loading states su tutte le pagine (skeleton)
- [ ] Error states con retry
- [ ] Toast feedback su ogni azione CRUD
- [ ] Mobile: verificare tutte le pagine < 768px
- [ ] Performance: Lighthouse > 90

### M7.4 — Verifica finale
- [ ] `npm run lint` — zero errori
- [ ] `npm run build` — build riuscita
- [ ] Flusso completo: register → onboarding → crea contatto → crea deal → drag in pipeline → crea task → completa task → AI summary → switch workspace
- [ ] Mobile: stesso flusso su viewport 375px
- [ ] Performance: FCP < 1.2s, Lighthouse > 90

---

## M8 — Deploy

- [ ] Creare repo GitHub `PoontoAgency/poonto-crm`
- [ ] Push codice su `main`
- [ ] Registrare progetto su The Lair (seguire `the_lair_tools.md`)
- [ ] Deploy su Vercel via The Lair
- [ ] Disabilitare Vercel SSO protection
- [ ] Verificare sito live raggiungibile
- [ ] Smoke test su URL produzione

---

> **Regola:** ogni task va spuntato `[x]` solo DOPO averlo completato e verificato.
> **Mai saltare avanti.** Sequenza esatta.
