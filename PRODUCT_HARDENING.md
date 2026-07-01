# Product Hardening Status

Last updated: 2026-05-30

## Current Position

This project is not production-ready yet. It is a working pediatric-care prototype with useful modules, but the product still has demo-only auth, optional file-backed demo health storage instead of a managed database, a monolithic frontend, and no real clinical governance layer.

## Market Signals Checked

- Summer Health: 24/7 pediatric text care, explicit covered/not-covered conditions, photos/video/audio intake, escalation to pediatrician/urgent care/ER, and controlled prescription language.
  Source: https://www.summerhealth.com/what-we-do
- Blueberry Pediatrics: licensed pediatricians day/night, home medical kit, photos/videos/vitals, developmental screening, and membership model.
  Source: https://www.blueberrypediatrics.com/l/g/without-the-waiting-room
- FTC mobile health app guidance: health apps need privacy/security analysis beyond HIPAA assumptions; FTC Act, Health Breach Notification Rule, COPPA, HIPAA, and FD&C Act can all matter.
  Source: https://www.ftc.gov/business-guidance/resources/mobile-health-apps-interactive-tool
- AAP telehealth guidance: pediatric telehealth should support coordinated care and the medical home model, not fragment care.
  Source: https://www.aap.org/en/practice-management/care-delivery-approaches/telehealth/
- FDA CDS guidance: clinical decision support scope must be separated from regulated medical device claims.
  Source: https://www.fda.gov/medical-devices/software-medical-device-samd/clinical-decision-support-software-frequently-asked-questions-faqs
- Gemini API docs: current API supports system instructions and GenerateContent configuration; medical safety behavior must be enforced server-side, not by UI copy alone.
  Source: https://ai.google.dev/gemini-api/docs/system-instructions
- OWASP API Security Top 10 API1:2023: every object access path needs object-level authorization checks and tests against BOLA regressions.
  Source: https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/
- HHS HIPAA Security Rule summary: health information systems need access control, audit controls, authentication, integrity, and transmission security safeguards before production claims.
  Source: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html
- AAP parent-care routing guidance: pediatric emergency routing needs clear ER/911 criteria such as breathing distress, blue lips, dehydration, seizures, and inability to wake; urgent chat must not delay care.
  Source: https://www.healthychildren.org/English/family-life/health-management/Pages/urgent-care-ER-or-pediatrician-a-parent-guide.aspx
- CDC respiratory virus emergency warning signs: children with fast/trouble breathing, bluish lips/face, or dehydration need immediate medical care.
  Source: https://www.cdc.gov/respiratory-viruses/about/index.html
- AAP/HealthyChildren infant fever guidance: babies 3 months or younger with rectal temperature 100.4°F / 38.0°C or higher should have immediate pediatrician contact.
  Source: https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Fever-and-Your-Baby.aspx
- AAP/HealthyChildren fever guidance: fever with stiff neck, unexplained rash, or repeated vomiting/diarrhea should trigger prompt pediatrician contact.
  Source: https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/When-to-Call-the-Pediatrician.aspx
- Open healthcare implementation leads: Health Samurai and OpenSRP show mature FHIR and immunization-oriented patterns worth evaluating before building proprietary health-record primitives.
  Sources: https://www.health-samurai.io/opensource and https://opensrp.io/global-immunization-product-suite/
- Current competitor/community signal: Summer Health and Blueberry position around 24/7 pediatric access, structured history intake, photos/videos/vitals, and explicit care-level routing; Reddit pediatric-practice discussions show operational pain around parent message volume, triage, same-day callbacks, and converting unclear calls into the right visit level.
  Sources: https://urgentcare.summerhealth.com/what-we-do, https://www.blueberrypediatrics.com/medical-kit, and https://www.reddit.com/r/pediatrics/comments/1qvjx8q/parents_expect_instant_responses_and_our_front/
- Current GitHub/open-healthcare scout: open symptom-checker projects and FHIR/MCP infrastructure are useful references, but not adopted yet; LangCare and Labinator remain `candidate/reference`, not installed or integrated.
  Sources: https://www.langcare.ai/ and https://github.com/LabinatorSolutions/medical-symptom-checker

## Completed Foundation Changes

- Server chat payload validation added before model calls.
- Pediatric AI prompt made more conservative: no prescriptions/dosing/diagnosis claims and explicit emergency escalation.
- Missing API key fallback changed from simulated consultation to safe unavailable-service response.
- Build output fixed from broken CommonJS server bundle to ESM server bundle.
- Index metadata changed from generic AI Studio demo to Russian pediatric product metadata.
- Fake first-screen claims and fake testimonials replaced with safer product signals and demo scenarios.
- PDF library moved from initial bundle into on-demand dynamic import.
- Growth chart moved out of the main app bundle into a lazy-loaded component.
- Main JavaScript bundle reduced below the 500 kB Vite warning threshold, then stabilized with explicit React, motion, and icon runtime chunks.
- Mobile navigation no longer requires horizontal scrolling; main nav and emergency close controls meet 44px touch target height.
- Vaccine tooltip positioning no longer creates hidden mobile horizontal overflow.
- Demo auth is now labeled as demo/local storage instead of claiming secure production compliance.
- Corrupted localStorage JSON no longer crashes the app on startup for core stored entities.
- Inline product favicon added to avoid the previous `/favicon.ico` 404.
- Server-side demo security foundation added: `/api/security/readiness` explicitly reports `productionReady: false`, `/api/auth/demo-session` requires consent, returns an opaque server demo token, and records a minimal in-memory audit event.
- Demo quick-login buttons now call the server-side consent session endpoint before setting the local prototype session.
- Child profile server API added: `/api/child-profile` requires a Bearer demo session and explicit consent, encrypts the raw pediatric profile payload with AES-256-GCM in the in-memory demo store, returns only the validated profile, and records a `child_profile_saved` audit event.
- Demo parent quick-login now also persists the synced child profile through `/api/child-profile`; localStorage remains only the prototype UI cache.
- Child profile read API added: `GET /api/child-profile` ignores client-supplied owner identifiers, resolves the record owner only from the current Bearer session, returns 404 for other users, and records a `child_profile_read` audit event.
- Demo UI can now hydrate a child profile back from the owner-scoped server endpoint when a server demo session exists.
- Base HTTP hardening added without external middleware: Express fingerprint header removed, API responses use `Cache-Control: no-store`, and app/API responses set `nosniff`, `DENY` framing, `no-referrer`, and restrictive camera/microphone/geolocation permissions policy.
- Optional file-backed demo security store added: `PEDIATR_SECURITY_STORE_PATH` plus `PEDIATR_HEALTH_DATA_KEY` persists demo sessions, encrypted child profiles, and audit events across server restart while keeping `productionReady: false`.
- Demo health-store files are ignored by git via `pediatr-security-store*.json`; `.env.example` documents the optional local/staging pilot variables and keeps the key framed as a secret.
- Deterministic pediatric red-flag triage added before LLM calls: breathing distress, blue lips/skin, seizures, inability to wake, dehydration, chest pain, and severe allergic reaction bypass the model and return immediate 103/112 escalation.
- Chat UI now renders emergency triage responses as a distinct red `Экстренная маршрутизация` message instead of a normal assistant answer.
- Age-aware pediatric care routing added for infant fever: a child under 3 months with temperature 38.0°C or higher bypasses the model and receives `urgent_same_day` guidance to contact a pediatrician/duty medical service.
- Chat UI now renders `urgent_same_day` care-route responses as a distinct amber `Срочная связь с педиатром` message and includes a quick helper for "Температура у младенца".
- Clinical routing extracted from `server.ts` into `src/clinicalRouter.ts` with an explicit `PEDIATRIC_CARE_ROUTE_RULES` registry and source ids for deterministic rule audits.
- Added another `urgent_same_day` route: fever with repeated vomiting or diarrhea now bypasses the model and tells the caregiver to contact the pediatrician/duty service today.
- Added AAP-aligned rash/meningitis routing: fever with stiff neck plus light sensitivity, and sudden purple/bruise-like rash, now bypass the model as emergency routes; fever with unexplained rash now bypasses the model as an `urgent_same_day` pediatrician route.
- First screen redesigned from a generic medical landing into a task-first pediatric care cockpit: the parent now chooses `Экстренно`, `Сегодня к педиатру`, or `Планово` before moving into AI chat, tools, or the child card.
- AI chat sidebar now starts with a structured pediatric intake rail covering age/weight, fever dynamics, symptom media, and red-flag escalation instead of only a freeform prompt.
- SOS banner, header, and navigation were compressed for dense operational use; compact nav labels now fit the 800px desktop viewport without pushing the hero below the fold.
- First-screen child profile gender controls were simplified and resized to avoid emoji/text overflow in compact cards.

## Verification

- `npm test`: 41 passing tests.
- `npm run lint`: TypeScript passed.
- `npm run build`: passed; main app chunk is 383.01 kB minified after runtime chunking, with `GrowthChart` and PDF export still split into separate lazy chunks.
- Browser check at `http://127.0.0.1:4174/`: page title correct, no console warnings/errors after navigation.
- Mobile viewport 390x844: no horizontal document overflow in tools/cabinet flows; nav scrollWidth equals clientWidth; nav buttons and emergency close button are 44px high.
- Growth chart browser check: lazy chunk loads on the child-card screen, SVG renders with measured dimensions, and Recharts no longer emits container-size warnings.
- Production server check at `http://127.0.0.1:4177/`: readiness endpoint returned `productionReady: false`; demo parent login created `sess_...` token, `aud_...` audit id, and `demo-consent-v1`; browser console had no errors or warnings.
- Production server check at `http://127.0.0.1:4178/`: `/api/auth/demo-session` plus `/api/child-profile` returned encrypted profile storage and an audit id; browser fetch interception confirmed demo parent login calls both `/api/auth/demo-session` and `/api/child-profile`; browser console had no errors or warnings.
- Server safety tests now cover unauthenticated profile reads, owner-scoped profile reads, `child_profile_read` audit logging, and a BOLA attempt where another session requests `?ownerId=u_b2c_demo` and receives no profile data.
- Current production API smoke at `http://127.0.0.1:4178/`: owner session saved and read `Максим` from encrypted profile storage; another session requesting `?ownerId=u_headers_parent` received 404 and no `Максим` in the response body; security headers were present and `X-Powered-By` was absent.
- Current production browser smoke at `http://127.0.0.1:4178/`: child profile rendered after demo flow/reload, document overflow stayed 0, and browser console warnings/errors were empty.
- File-backed store unit test proves restart persistence for session/profile/audit, encrypted raw profile storage, and read-audit append after restart.
- Current production file-backed API smoke at `http://127.0.0.1:4178/`: readiness returned `storageMode: file-demo` and `productionReady: false`; after server restart the same session read `Максим`, raw store JSON did not contain `Максим` or `2025-05-15`, and `child_profile_read` appeared in the store.
- Current production file-backed browser smoke at `http://127.0.0.1:4178/`: product page rendered, horizontal overflow stayed 0, and browser console warnings/errors were empty.
- Emergency triage tests prove red-flag detection and model bypass: an emergency prompt returns `isEmergencyTriage: true`, `level: emergency`, signals for breathing distress/blue lips/seizure/dehydration, and does not call the configured AI model.
- Current production emergency API smoke at `http://127.0.0.1:4178/`: "судороги, тяжело дышит, губы синеют" returned `isEmergencyTriage: true`, matched `breathing_distress,blue_lips_or_skin,seizure`, and included 103/112.
- Current production emergency browser smoke at `http://127.0.0.1:4178/`: chat rendered `Экстренная маршрутизация`, included 103/112, used the red emergency panel, document overflow stayed 0, and browser console warnings/errors were empty.
- Infant-fever care-route tests prove age parsing for months/weeks, `urgent_same_day` routing for fever 38.0°C+ under 3 months, and model bypass before Gemini.
- Current production infant-fever API smoke at `http://127.0.0.1:4178/`: "Ребенку 8 недель, температура 38.2" returned `isCareRoute: true`, `level: urgent_same_day`, `ageMonths: 2`, signal `infant_under_3_months_fever`, and no 103/112 emergency-number wording in the route response.
- Current production infant-fever browser smoke at `http://127.0.0.1:4178/`: quick helper rendered `Срочная связь с педиатром`, used the amber urgent panel, document overflow stayed 0, and browser console warnings/errors were empty.
- Clinical-router module tests prove the rule registry has stable ids/source ids, emergency routes outrank urgent routes, fever with repeated vomiting/diarrhea maps to `urgent_same_day`, and direct emergency detection remains audit-callable.
- Current production fever/vomiting API smoke at `http://127.0.0.1:4178/`: "Ребенку 5 лет, температура 38.7, повторная рвота и диарея" returned `isCareRoute: true`, `level: urgent_same_day`, signal `fever_with_repeated_vomiting_or_diarrhea`, and no 103/112 emergency-number wording.
- Current production browser smoke after clinical-router extraction at `http://127.0.0.1:4178/`: product and AI tab rendered, document overflow stayed 0, and browser console warnings/errors were empty.
- Current clinical-router tests prove meningitis-like fever red flags route to emergency, sudden purple/bruise-like rash routes to emergency, and fever with unexplained rash routes to `urgent_same_day`.
- Current production API smoke at `http://127.0.0.1:4178/`: "У ребенка температура 39, ригидная шея и больно смотреть на свет" returned `level: emergency`, signal `stiff_neck_light_sensitivity`, and 103/112 wording; "Ребенку 4 года, температура 38.6 и появилась непонятная сыпь" returned `level: urgent_same_day`, signal `fever_with_unexplained_rash`, pediatrician wording, and no emergency-number wording.
- Current production browser smoke at `http://127.0.0.1:4178/`: emergency meningitis-like prompt rendered `Экстренная маршрутизация` with 103/112; fever-rash prompt rendered `Срочная связь с педиатром` without false 103/112 wording; document overflow stayed 0 and browser console warnings/errors were empty.
- Current production UX browser check at `http://127.0.0.1:4178/`: first screen renders `care_cockpit_hero`; urgent banner is 60px high, header is 92px high, hero starts at y=184 with no horizontal overflow, no clipped measured elements, no small measured click targets, and no console warnings/errors.
- Current production AI-intake browser check at `http://127.0.0.1:4178/`: structured intake rail renders in the AI tab, contains the four required intake categories, keeps document overflow at 0, has no clipped measured elements, and emits no console warnings/errors.

## Next Gates

1. Product truth gate: define the product as either parent preparation assistant, clinician-reviewed telepediatrics platform, or clinic SaaS. Do not mix all three without role boundaries.
2. Clinical safety gate: expand deterministic triage into a maintained symptom-router with age bands, caregiver-friendly next steps, clinician review policy, and FDA/FTC/AAP scope audit.
3. Data/security gate: replace file-backed demo sessions with managed server-side auth, database-backed consent records, encrypted storage, audit retention, backup/recovery, and privacy/legal copy.
4. Architecture gate: continue splitting `src/App.tsx` into domain modules, lazy-load cabinet/quiz surfaces, and remove global state sprawl.
5. UX gate: keep moving from the new pediatric care cockpit toward full product-grade UX: mobile screenshot QA, keyboard/a11y pass, component extraction, state-specific empty/error/loading surfaces, and clinician/parent role boundaries.
6. Performance gate: reduce initial JS below 500 kB minified and keep route-level chunks accountable.
7. Test gate: add component/integration tests for auth boundary, chat fallback, vaccine reminders, growth calculations, mobile navigation, and PDF export failure path.
