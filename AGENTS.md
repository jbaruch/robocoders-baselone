# AGENTS.md — Operating Instructions for AI Coding Agents (PDD)

This repository uses Prompt‑Driven Development (PDD). Follow these rules exactly. When in doubt, stop and ask for clarification.

---

MANDATORY: Context7 MCP First

- Always consult Context7 MCP before writing any code that uses a library, framework, SDK, service, device API, protocol, or external tool.
- You do not know anything about any library or API. Never rely on pre‑trained information, web search, or assumptions. Never hallucinate.
- All technical knowledge must come from Context7 MCP.
- Workflow:
  1) Resolve the library or product name (Context7 MCP: resolve‑library‑id)
  2) Fetch the relevant documentation (Context7 MCP: get‑library‑docs)
  3) Cite the MCP documentation (include link/ID) when making technical decisions
  4) If new docs contradict the plan, update requirements/plan/tasks before coding

---

Methodology Summary (see docs/prompt-driven-development.md)

Artifacts and Gates:
0) .junie/guidelines.md — Team working instructions
1) docs/requirements.md — Structured, testable requirements with acceptance criteria
2) docs/plan.md — Implementation plan linked to requirements, with priorities and dependencies
3) docs/tasks.md — PRIMARY ARTIFACT: granular tasks with dual links (→ plan item and → requirement)

Rules:
- Every plan item links to ≥1 requirement
- Every task links to exactly one plan item and ≥1 requirement
- No orphaned items. Broken links require immediate stop and repair
- Phase gates: commit and tag (pdd-phase-{n}-{name}) before advancing

---

Project Context (see docs/project-description.md)

- Goal: Web app that reads the webcam’s dominant color and controls a Shelly Duo GU10 RGBW bulb over local network
- Design: Simplicity first — NO cloud, databases, Docker, or complex infra
- Tech Stack:
  - Backend: Java 25 (LTS), Spring Boot 3.5.6, Maven 3.9+
  - Frontend: Vanilla HTML5 + Modern JavaScript (ES2024) + Modern CSS
- Out of Scope: See the explicit list in docs/project-description.md; do not implement excluded items

---

Activation Rules — Frontend vs. Backend

Determine which sections apply by inspecting repository structure or file extensions.

Frontend active if ANY is true:
- Presence of *.html, *.js, or *.css files anywhere
- Presence of index.html, app.js, or styles.css
- Frontend folders present: public/, static/, assets/, web/, ui/, or src/client/

Backend active if ANY is true:
- pom.xml present at repo root
- *.java under src/main/java/ or src/test/java/
- Spring Boot entry class pattern (e.g., *Application.java) under src/main/java/

If both are active, treat as full‑stack and follow both sets of guidance.

---

Frontend Guidance (Vanilla HTML/CSS/JS)

- No frameworks/bundlers/preprocessors. Keep it simple.
- For any browser APIs beyond basic DOM, consult Context7 MCP first (e.g., MediaDevices, Canvas getImageData()).
- Recommended simple file set:
  - index.html — Structure; large, touch‑friendly controls; high contrast
  - app.js — Camera access + color sampling + backend interactions
  - styles.css — Responsive layout using Flexbox/Grid
- Reliability: Graceful degradation if camera/bulb unavailable; user messaging
- Testing: Prefer Playwright; use stable semantic selectors

Backend Guidance (Java 25 + Spring Boot 3.5.6 + Maven)

- Minimal Spring Boot app to expose endpoints for Shelly bulb control; keep code clear and short
- For any libraries or device APIs, resolve and fetch docs via Context7 MCP first
- Keep configuration minimal; avoid all items listed as out of scope
- Testing: Unit tests for service logic are optional but encouraged for demos

---

PDD Workflow You Must Follow

1) Step 0 — Guidelines
- Verify .junie/guidelines.md exists and adopt MCP First policy

2) Step 1 — Requirements
- Create docs/requirements.md with numbered user stories and testable acceptance criteria (cover happy paths, edge cases, errors, persistence/state, UI/UX)

3) Step 2 — Plan
- Create docs/plan.md with items linked to requirements, priorities, and dependencies

4) Step 3 — Tasks (PRIMARY)
- Create docs/tasks.md with checkboxes and dual links (→ plan item and → requirement)
- Group by phases: Setup & Infrastructure; Core; Advanced; Integration & Testing; Polish & QA; Documentation & Deployment

Version Control Discipline
- Commit each phase artifact
- Tag: pdd-phase-{n}-{name}
- Keep working tree clean at each gate

Operational Checklists
- Before coding: [ ] Resolve libs via Context7 MCP; [ ] Fetch docs; [ ] Update plan/tasks if necessary
- Frontend active? [ ] *.html/*.js/*.css or typical frontend dirs present
- Backend active? [ ] pom.xml present or *.java under src/main/java/

Links
- PDD Methodology: docs/prompt-driven-development.md
- Project PRD: docs/project-description.md
- Team Guidelines: .junie/guidelines.md
