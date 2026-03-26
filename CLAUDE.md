# TESTPoonto — Regole di Progetto

> ⚠️ Questo file va letto ad ogni nuova sessione di lavoro.
> Contiene tutte le convenzioni, lo stack e i riferimenti per lavorare su questo progetto.

---

## 🧠 MEMORIA AI — Obbligo di lettura

> **OBBLIGO ASSOLUTO.** Prima di qualsiasi azione su questo progetto, leggere TUTTI i file in `../Memoria AI/`.

1. Leggere `../Memoria AI/memoriaAI.md` — prompt operativo con regole, struttura, recap progetti
2. Leggere `../Memoria AI/memoria_generale.md` — contesto globale: Stefano, Poonto, tutti i progetti
3. Leggere **TUTTI** gli altri file `.md` presenti nella cartella `../Memoria AI/`
4. **Non procedere** finché non hai letto tutti i file. Nessuna eccezione.

---

## 🚨 OBBLIGO 1 — The Lair & Guida Operativa

> **OBBLIGO ASSOLUTO.** Non esistono alternative. Non esistono scorciatoie.
> Ogni violazione è un errore grave.

Per **TUTTE** le seguenti operazioni è **OBBLIGATORIO**:
1. Leggere la guida `../Memoria AI/the_lair_tools.md` **PRIMA** di eseguire qualsiasi comando
2. Seguire il workflow esattamente come descritto, passo per passo
3. Usare **ESCLUSIVAMENTE** i token e le credenziali salvati su Hetzner VPS (`/home/lair/projects/the-lair/.env`)
4. **MAI** usare token/password hardcoded, `npx vercel` diretto, o qualsiasi workaround

### Operazioni coperte dall'obbligo:
- **Creare repo GitHub** → guida, sezione CASO 1
- **Registrare progetto su The Lair** → guida, sezione CASO 1, Passo 3
- **Deploy (Vercel)** → guida, sezione CASO 1, Passo 4
- **Creare/modificare tabelle Supabase** → guida, sezione Supabase
- **Collegare dominio custom** → guida, sezione Cloudflare + Vercel
- **Inviare notifiche Telegram** → guida, sezione Telegram
- **Qualsiasi operazione con API esterne** → guida

### Regole segreti:
- **MAI** committare password, token, API key o credenziali in nessun file del repo
- I segreti vivono SOLO su Hetzner e in Memoria AI, MAI nel codice

## 🚨 OBBLIGO 2 — Task Breakdown

> **OBBLIGO ASSOLUTO.** Non esistono scorciatoie. Non si salta nessun task.

1. **PRIMA** di iniziare qualsiasi lavoro: aprire e leggere `TASK_BREAKDOWN.md`
2. Individuare il **prossimo task non spuntato** nell'ordine scritto
3. Eseguire **quel task e solo quel task**
4. **Spuntarlo** nel file (`[ ]` → `[x]`) dopo averlo completato
5. Passare al task successivo — **MAI saltare avanti**
6. Se un task è un test/verifica → **eseguirlo davvero**, non saltarlo
7. Non passare alla milestone successiva finché TUTTI i task della milestone corrente non sono `[x]`

## 🚨 OBBLIGO 3 — Qualità sopra velocità

> **OBBLIGO ASSOLUTO.** Non si va di fretta. Si fanno le cose per bene.

- Scegliere **SEMPRE** la strada più professionale, mai quella più veloce e superficiale
- Ogni file scritto deve essere **testato e verificato** prima di considerarlo completato
- Mai scrivere codice "tanto poi lo sistemo" — farlo giusto la prima volta
- Se c'è un modo corretto e uno veloce, scegliere **SEMPRE** quello corretto
- Non accumulare debito tecnico: fix, test e verifica subito, non "dopo"
- La fretta produce errori (secret leak, deploy falliti, task saltati) — la calma produce qualità

---

## Progetto

**TESTPoonto** — Progetto di test.

- **Stato:** Nuovo — da definire
- **Owner:** Stefano Colicino / Poonto S.r.l.
- **Task:** `TASK_BREAKDOWN.md` (in questa cartella — checklist operativa, da creare)

---

## Stack

> Da definire in base alle esigenze del progetto.

---

## Convenzioni

### Naming
| Cosa | Regola | Esempio |
|------|--------|---------|
| File Python | snake_case | `my_service.py` |
| Classi Python | PascalCase | `MyService` |
| File React (componenti) | PascalCase | `MyCard.tsx` |
| File React (hook) | camelCase con `use` | `useMyData.ts` |
| File React (servizi) | camelCase | `myService.ts` |
| Tabelle DB | snake_case plurale | `my_items` |
| Colonne DB | snake_case | `company_id` |

### Git
- **Branch:** `feature/xxx`, `fix/xxx`, `chore/xxx`
- **Commit:** Conventional Commits → `feat(scope): descrizione`
- **Main branch:** `main`
- **Non lavorare mai direttamente su `main`** — branch separati per ogni feature

---

## Deploy

### Via The Lair (metodo standard)

> ⚠️ Tutti i comandi deploy, credenziali e token sono documentati in:
> - `../Memoria AI/the_lair_tools.md` — workflow completo passo per passo
> - `../Memoria AI/the_lair_briefing.md` — infrastruttura e stato live
>
> **Non duplicare segreti in questo repo.**

### Credenziali
> ⚠️ Tutte le credenziali sono centralizzate su The Lair (Hetzner VPS) e in `Memoria AI/`.
> Non committare mai segreti in questo repo.
- **Riferimento:** `../Memoria AI/the_lair_tools.md`

---

## Riferimenti
- **Memoria AI:** `../Memoria AI/` (contesto globale, credenziali, progetti)
- **The Lair tools:** `../Memoria AI/the_lair_tools.md` (workflow deploy dettagliato)
- **The Lair briefing:** `../Memoria AI/the_lair_briefing.md` (infrastruttura e stato live)
