# Junie Team Guidelines — Prompt‑Driven Development (Phase 4)

Last updated: 2025-10-05
Owner: Team Lead (PDD custodian)

Purpose: This document encodes the working rules for maintaining Prompt‑Driven Development (PDD) artifacts and for generating the frontend/backend documentation from requirements. It is the operational “contract” for the team.


ALWAYS — Context7 MCP First (Hard Rule)
- Before writing any code or prescribing any API usage, you MUST consult Context7 MCP documentation.
- You do not know anything about any library or API by default. Never rely on pre‑trained information, never search in other places, and never hallucinate or assume. All technical knowledge MUST come from Context7 MCP.
- Operational steps:
  1) Resolve the library or product via Context7 MCP resolve-library-id (exact library name or best guess from requirements).
  2) Fetch the specific documentation via Context7 MCP get-library-docs (narrow the topic to what you are about to code).
  3) Work only from what MCP returns. If needed, repeat with a different topic scope.
  4) Record the MCP library IDs and topics consulted in PR descriptions and in the relevant doc sections.
- If MCP content conflicts with prior assumptions, MCP wins. Update artifacts accordingly.


PDD Alignment and Phase Gates (from docs/prompt-driven-development.md)
- Phase 1 — Requirements: docs/requirements.md (numbered user stories + testable acceptance criteria). STOP gate: human approval required.
- Phase 2 — Implementation Plan: docs/plan.md (items link back to requirements; priorities and dependencies). STOP gate: human approval required.
- Phase 3 — Tasks (PRIMARY): docs/tasks.md (checkboxed, phase‑grouped tasks; each task links to a plan item and requirement(s)). HARD STOP gate: human approval required.
- Phase 4 — Guidelines (this file): working rules below. STOP gate: team acknowledgment.


Task Completion Protocol (applies to docs/tasks.md)
- Mark tasks as [x] when complete; never delete completed tasks.
- Keep the phase structure intact: Setup & Infrastructure; Core Features; Advanced Features; Integration & Testing; Polish & QA; Documentation & Deployment.
- New tasks may be added only if they link to: (a) at least one plan item in docs/plan.md, and (b) at least one requirement in docs/requirements.md.
- Preserve formatting consistency: checkboxes, links, and phase headings.


Traceability Maintenance
- Every plan item must reference ≥1 requirement (by number). Every task must reference 1 plan item + ≥1 requirement.
- If a requirement changes, cascade updates: reopen Phase 1 → update plan (Phase 2) → update tasks (Phase 3) → validate these guidelines (Phase 4).
- If a plan item changes, update affected tasks and re‑verify requirement links.
- No orphaned artifacts. Broken links are a release blocker.


Change Management Rules
- Document rationale for any scope change directly in the PR and, where relevant, in the affected docs.
- Update artifacts strictly in sequence (Requirements → Plan → Tasks → Guidelines).
- Re‑validate traceability after changes; fix broken links immediately.


Repository Structure (required)
- docs/
  - requirements.md  (Phase 1)
  - plan.md          (Phase 2)
  - tasks.md         (Phase 3, PRIMARY)
- .junie/
  - guidelines.md    (Phase 4, this file)
- Version control:
  - Commit each phase before proceeding.
  - Tag format: pdd-phase-{n}-{name} (e.g., pdd-phase-1-requirements, pdd-phase-3-tasks).
  - Working tree must be clean at each gate.


Frontend/Backend Documentation Generation (from docs/requirements.md)
Goal: Maintain separate, auto‑activated docs for frontend and backend derived from the single source of truth in docs/requirements.md.

1) Output files and ownership
- docs/frontend.md — Frontend spec and guidance (owner: Frontend lead)
- docs/backend.md — Backend spec and guidance (owner: Backend lead)
- Both files must clearly state their source: “Derived from docs/requirements.md (Phase 1) under PDD.”

2) Tech stack (must be mirrored verbatim from requirements)
- Backend:
  - Java: 25 (LTS, released September 2025)
  - Spring Boot: 3.5.6 (latest stable)
  - Build Tool: Maven 3.9+
- Frontend:
  - Core: Vanilla HTML5 + Modern JavaScript (ES2024)
  - Color Detection: Color Thief 2.4.0
  - Styling: Modern CSS with CSS Grid/Flexbox

3) Activation rules (directory and extension heuristics)
- Backend doc activation when ANY of the following are present:
  - pom.xml in project root or a module directory
  - src/main/java/ exists
  - Files with .java extension under src/** OR a class with a main method indicative of Spring Boot (e.g., @SpringBootApplication)
- Frontend doc activation when ANY of the following are present:
  - index.html at project root or in a conventional web dir (e.g., frontend/, public/, web/, src/main/resources/static/)
  - .js or .css files co‑located with index.html or in a /frontend‑like directory
- If both sets of signals exist, generate/update both docs. If neither exists yet, generate stubs to be completed when code is added.
- Do not infer additional frameworks or tools; adhere to requirements (no React/Vue/Angular, no Webpack/Vite, no Sass/Less).

4) Required sections for docs/frontend.md
- Purpose and scope
- Activation signals detected (list the files/paths that triggered generation)
- Tech stack (from requirements; do not alter versions)
- UI/UX non‑functional requirements (touch targets ≥50px, high contrast)
- Features:
  - Camera selection and continuous preview
  - Manual send and Auto mode (every 3 seconds)
- Out of scope (mirror the Frontend exclusions from requirements)
- Testing notes (browser matrix: Chrome/Firefox/Safari; basic E2E checks)
- MCP consultation log: list the Context7 MCP library IDs and topics used (e.g., “Color Thief 2.4.0 usage docs”).

5) Required sections for docs/backend.md
- Purpose and scope
- Activation signals detected
- Tech stack (from requirements)
- API surface outline (e.g., ColorController endpoints) — do not code here; outline only
- Service responsibilities (e.g., ShellyBulbService calling device over LAN)
- Out of scope (mirror the Backend exclusions from requirements)
- Testing notes (unit tests optional; outline integration strategy if any)
- MCP consultation log: list the Context7 MCP library IDs and topics used (e.g., “Spring Boot 3.5.6 RestClient”).

6) Generation workflow (authoritative steps)
- Input: docs/requirements.md (Phase 1, approved)
- Process:
  1) Parse requirements and non‑functional constraints.
  2) Detect activation signals from current repo layout (see rules above).
  3) For each activated side (frontend/backend):
     - Copy the Tech stack exactly as specified in requirements.
     - List relevant acceptance criteria that the side is responsible for.
     - Enumerate “Out of Scope” items pertinent to that side.
     - Insert an MCP consultation checklist and space to record MCP IDs/topics.
  4) Save/update docs/frontend.md and/or docs/backend.md.
- Output: Updated side‑specific docs with traceability note: “Linked to Phase 1 requirements (numbers: …).”

7) MCP‑first authoring checklist for side docs
- [ ] Resolve each referenced library with Context7 MCP (e.g., “spring boot”, “color thief”).
- [ ] Fetch topical docs before referencing API names or usage patterns.
- [ ] Record MCP IDs and topics consulted.
- [ ] If MCP cannot resolve a library, raise a Phase 1 clarification before proceeding.


Non‑Functional and Out‑of‑Scope Enforcement (from docs/requirements.md)
- Enforce usability constraints (zero configuration; large buttons; high contrast).
- Enforce reliability constraints (graceful degradation; auto‑reconnect camera; no crashes on invalid camera selection).
- Explicitly DO NOT implement anything listed as out of scope in requirements (e.g., WebSockets, databases, Docker, frontend frameworks, build tools, etc.).


Testing & Acceptance (cross‑reference)
- Integration testing (headless browser) checklist must be reflected in tasks and, when relevant, in side docs.
- Demo acceptance criteria from requirements must remain traceable to tasks; the side docs may restate them for clarity but tasks are authoritative.


Formatting Standards
- Use Markdown headings; keep sections in the order listed above for each side doc.
- Use bullet lists; prefer short, actionable statements over prose.
- Link by relative paths: [requirements](../docs/requirements.md), [plan](../docs/plan.md), [tasks](../docs/tasks.md).


Compliance Checklist (to run before merge)
- [ ] MCP log present in PR description (IDs + topics)
- [ ] docs/frontend.md updated if frontend signals present
- [ ] docs/backend.md updated if backend signals present
- [ ] All new tasks link to plan and requirements
- [ ] No broken traceability links
- [ ] Out‑of‑scope features have not been introduced


Review & Sign‑Off
- At each STOP/HARD STOP gate, a human reviewer must confirm:
  - Requirements completeness/testability (Phase 1)
  - Plan coverage and priorities (Phase 2)
  - Task granularity and dual links (Phase 3)
  - Adherence to these guidelines (Phase 4)


Appendix A — Minimal skeletons for side docs

---

File: docs/frontend.md (skeleton)

# Frontend — Vibecoding Demo

Source of truth: Derived from ../docs/requirements.md (Phase 1)

- Activation signals: <fill based on repo scan>
- Tech stack:
  - Vanilla HTML5 + Modern JavaScript (ES2024)
  - Color Thief 2.4.0
  - CSS with CSS Grid/Flexbox
- Non‑functional: touch targets ≥50px; high contrast; zero config
- Features: camera selection & preview; manual send; auto send every 3s
- Out of scope: (mirror requirements)
- Testing notes: Chrome/Firefox/Safari; E2E checks from requirements
- MCP consultation log: <Context7 MCP IDs + topics>

---

File: docs/backend.md (skeleton)

# Backend — Vibecoding Demo

Source of truth: Derived from ../docs/requirements.md (Phase 1)

- Activation signals: <fill based on repo scan>
- Tech stack:
  - Java 25 (LTS, Sep 2025)
  - Spring Boot 3.5.6
  - Maven 3.9+
- Responsibilities: REST endpoint; device control service
- Out of scope: (mirror requirements)
- Testing notes: unit tests optional; integration strategy summary
- MCP consultation log: <Context7 MCP IDs + topics>
