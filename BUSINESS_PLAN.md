# 📋 POONTO CRM — Business Plan

> Versione 1.0 — 26/03/2026
> Autore: Poonto S.r.l. con supporto Claude AI

---

## 1. Il Problema

Le PMI italiane e le agenzie come Poonto hanno **3 problemi** con i CRM attuali:

| Problema | Dettaglio |
|----------|-----------|
| **Troppo complessi** | HubSpot, Salesforce → servono settimane di formazione, 80% delle funzioni non si usa |
| **Troppo costosi** | €14-50/utente/mese × team → €200-600/mese per una PMI |
| **Non pensati per agenzie** | Nessun CRM permette a un'agenzia di gestire i propri clienti E dare uno strumento CRM ai clienti stessi |

**Il gap di mercato:** nessuno offre un CRM che un'agenzia usa internamente E fornisce ai propri clienti come servizio a valore aggiunto.

---

## 2. La Soluzione — Poonto CRM

> **Il CRM più semplice e smart del mondo.** Pensato per chi lavora, non per chi configura.

### Filosofia del prodotto
- **3 click rule** — qualsiasi azione si completa in massimo 3 click
- **AI-first** — l'AI non è un add-on, è il motore. Suggerisce, scrive, automatizza
- **Zero formazione** — se devi spiegare come si usa, è sbagliato
- **Mobile-first** — la maggior parte degli utenti PMI lavora da telefono

### Cosa lo rende diverso

| Feature | Competitor | Poonto CRM |
|---------|-----------|-------------|
| Setup | 30-60 minuti | 2 minuti (importa contatti e vai) |
| AI | Bolt-on, extra $$$ | Nativo: riassunti, suggerimenti, tono di voce |
| Prezzo | €14-50/utente/mese | €29/mese flat (team illimitato) |
| Multi-livello | No | Sì: agenzia gestisce i CRM dei clienti |
| Lingua | Inglese + traduzioni | Italiano nativo |
| Integrazioni | 500 app che non usi | WhatsApp, email, Telegram — solo quelle che servono |

---

## 3. Target

### Target primario — Poonto (uso interno)
- Gestione 15+ clienti agenzia
- Storico conversazioni, brief, deliverable, fatturazioni
- Dashboard team con task e scadenze
- È anche il banco di prova del prodotto

### Target secondario — Clienti Poonto
- Le PMI clienti di Poonto ricevono il CRM come servizio incluso o a piccolo costo
- Gestiscono i LORO clienti (es. il ristorante gestisce i suoi ospiti)
- Poonto ha visibilità trasversale su tutto

### Target terziario — Altre agenzie italiane (SaaS)
- Agenzie di comunicazione/marketing italiane (stimato: 5.000-8.000 in Italia)
- Stesso modello: usano il CRM internamente + lo danno ai clienti
- Prezzo SaaS diretto

---

## 4. Mercato

| Dato | Valore |
|------|--------|
| Mercato CRM Italia 2025 | $330M |
| Crescita annua (CAGR) | 10.9% |
| Mercato CRM Italia 2035 (previsto) | $936M |
| PMI in Italia | ~4.5 milioni |
| Agenzie marketing/comunicazione Italia | ~5.000-8.000 |
| Quota presa da soluzioni semplici (SMB) | Segmento più grande e in crescita |

**Trend chiave:**
- AI-driven personalization → ✅ noi lo facciamo nativo
- Mobile-first → ✅ noi lo facciamo nativo
- GDPR/privacy italiana → ✅ noi lo facciamo di default
- Prezzo accessibile per PMI → ✅ flat, non per-seat

---

## 5. Funzionalità MVP

### 🟢 Core (Fase 1 — MVP)

| Modulo | Funzione | Dettaglio |
|--------|----------|-----------|
| **Contatti** | Rubrica smart | Import CSV/vCard, dedup automatica, tag, segmenti |
| **Pipeline** | Kanban vendite | Drag & drop, stadi personalizzabili, valore deal |
| **Attività** | Task & follow-up | Task con scadenza, reminder automatici, collegamento a contatto/deal |
| **Note & Timeline** | Storico completo | Timeline cronologica di tutto ciò che è successo con un contatto |
| **AI Assistant** | Smart companion | Riassunto contatto, suggerimento prossima azione, draft email, analisi sentiment |
| **Dashboard** | KPI in tempo reale | Pipeline value, task scaduti, attività team, conversion rate |
| **Multi-tenant** | Agenzia → Clienti | L'agenzia crea workspace per ogni cliente, con permessi separati |

### 🟡 Fase 2 (post-MVP)

| Modulo | Funzione |
|--------|----------|
| **Email** | Invio/ricezione email dal CRM (sync IMAP/SMTP) |
| **WhatsApp** | Chat WhatsApp Business integrata |
| **Automazioni** | Workflow visuale: "se contatto non risponde dopo 3 giorni → invia reminder" |
| **Report** | Report PDF automatici settimanali/mensili |
| **Fatturazione** | Preventivi e fatture base (formato italiano) |
| **API pubblica** | Webhook + REST API per integrazioni custom |

### 🔴 Fase 3 (crescita)

| Modulo | Funzione |
|--------|----------|
| **Telegram Bot** | Gestione contatti e notifiche via Telegram |
| **AI Scoring** | Lead scoring predittivo con AI |
| **White-label** | CRM completamente brandizzabile per l'agenzia cliente |
| **Marketplace** | Plugin/integrazioni di terze parti |

---

## 6. Stack Tecnologico

| Layer | Tecnologia | Motivo |
|-------|------------|--------|
| Frontend | React 19 + Vite 6 + TypeScript | Velocità, ecosystem, competenza team |
| Styling | Tailwind CSS 4 | Rapid prototyping, design system |
| State | Zustand + TanStack Query | Leggero, efficiente, cache server |
| Backend | Supabase | PostgreSQL + RLS multi-tenant + Auth + Real-time + Edge Functions |
| AI | OpenAI GPT-4o | Riassunti, suggerimenti, draft, analisi |
| Deploy | Vercel (frontend) | Deploy automatico da GitHub |
| CI/CD | The Lair | Pipeline centralizzata Poonto |
| DNS/CDN | Cloudflare | Performance + protezione |

**Costo infrastruttura stimato (MVP):**

| Voce | Costo/mese |
|------|------------|
| Supabase Pro | $25 |
| Vercel Pro | $20 |
| OpenAI (stima 100 clienti) | $30-50 |
| Cloudflare | $0 (free tier) |
| **Totale** | **~$75-95/mese** |

---

## 7. Modello di Business

### Pricing

| Piano | Prezzo | Per chi | Incluso |
|-------|--------|---------|---------|
| **Free** | €0/mese | Prova + freelancer | 100 contatti, 1 utente, no AI |
| **Starter** | €29/mese | PMI singola | Contatti illimitati, 3 utenti, AI base, 1 workspace |
| **Agency** | €79/mese | Agenzie | Tutto Starter + workspace clienti illimitati, 10 utenti, AI full, report |
| **Scale** | €149/mese | Agenzie grandi | Tutto Agency + white-label, API, utenti illimitati, supporto prioritario |

### Revenue projection (anno 1-3)

| Periodo | Clienti stimati | MRR | ARR |
|---------|----------------|-----|-----|
| Mese 6 | 10 (Starter) + 2 (Agency) | €448 | €5.376 |
| Mese 12 | 30 (Starter) + 8 (Agency) + 2 (Scale) | €1.800 | €21.600 |
| Mese 24 | 100 (Starter) + 25 (Agency) + 10 (Scale) | €6.375 | €76.500 |
| Mese 36 | 300 (Starter) + 60 (Agency) + 25 (Scale) | €17.165 | €205.980 |

### Break-even
- Costi infra: ~€100/mese
- Costi AI: scala con utenti (~€0.30/utente/mese)
- **Break-even: 4 clienti Starter** (€116 vs €100 costi)
- Margine operativo a regime: **85-90%** (SaaS puro)

---

## 8. Strategia Go-to-Market

### Fase 1 — Poonto dogfooding (Mese 1-2)
- Poonto usa il CRM per i propri 15+ clienti
- Raccoglie feedback reale ogni giorno
- Affina UX e AI

### Fase 2 — Clienti Poonto (Mese 2-4)
- Offre il CRM ai clienti esistenti come valore aggiunto
- 5-10 clienti beta
- Case study reali

### Fase 3 — Lancio pubblico (Mese 4-6)
- Landing page con demo interattiva
- Content marketing (blog SEO, video)
- Partnership con altre agenzie italiane
- Listing su AppSumo / ProductHunt Italia

### Fase 4 — Crescita (Mese 6+)
- Referral program (1 mese gratis per ogni agenzia portata)
- Webinar/formazione per agenzie
- Integrazioni con tool italiani (fatturazione, PEC)

---

## 9. Vantaggi Competitivi (Moat)

| Vantaggio | Dettaglio |
|-----------|-----------|
| **AI nativa** | Non è un plugin — è il cuore del prodotto |
| **Modello agenzia** | Unico CRM pensato per "gestisco i miei clienti + do uno strumento ai clienti dei miei clienti" |
| **Prezzo flat** | No per-seat pricing — cresce con te senza sorprese |
| **Italiano nativo** | UX, AI, supporto — tutto in italiano da day 1 |
| **Stack moderno** | Real-time, veloce, mobile-first — non un monolite legacy riscritto |
| **Ecosystem Poonto** | Si integra con AIDA (ristoranti), Luce (serramentisti) — cross-sell naturale |

---

## 10. Rischi e Mitigazioni

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| Mercato saturo | Media | Differenziazione su semplicità + modello agenzia |
| Costi AI imprevedibili | Bassa | Cache intelligente, modelli locali per task semplici |
| Churn clienti | Media | Onboarding guidato, stickiness con dati + integrazioni |
| Competitor copiano modello agenzia | Bassa | First mover advantage + ecosystem Poonto |
| Scaling tecnico | Bassa | Supabase scala nativamente, architettura stateless |

---

## 11. Timeline MVP

| Settimana | Milestone | Deliverable |
|-----------|-----------|-------------|
| 1 | Foundation | Progetto inizializzato, DB schema, auth, layout base |
| 2 | Contatti | CRUD contatti, import CSV, ricerca, tag |
| 3 | Pipeline | Kanban board, deal management, drag & drop |
| 4 | Attività & Timeline | Task, follow-up, timeline contatto, reminder |
| 5 | AI & Dashboard | AI assistant, KPI dashboard, grafici |
| 6 | Multi-tenant | Workspace agenzia, permessi, onboarding |
| 7 | Polish & Beta | UX polish, mobile responsive, performance |
| 8 | Launch | Deploy produzione, landing page, primi utenti |

---

## 12. Nome Prodotto

Proposte (da valutare con Stefano):

| Nome | Vibe |
|------|------|
| **Punto CRM** | Gioco di parole Poonto, diretto |
| **Ciao CRM** | Italiano, amichevole, semplice |
| **Filo** | "Il filo con i tuoi clienti" — elegante |
| **Cerchia** | La tua cerchia di clienti — italiano, caldo |
| **Ponte** | Il ponte tra te e i tuoi clienti |

---

> **Prossimo passo:** Approvazione business plan → Creazione TDD tecnico → Implementazione MVP (8 settimane).
