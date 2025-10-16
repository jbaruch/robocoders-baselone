# Junie Guidelines — Prompt-Driven Development (PDD)

Purpose: This document operationalizes Prompt-Driven Development for this repository and defines activation rules for frontend and backend work. It also enforces a strict policy for consulting Context7 MCP before any coding decisions involving libraries, frameworks, or APIs.

---

Mandatory Policy: Context7 MCP First

- Always consult Context7 MCP before writing any code that uses a library, framework, SDK, service, device API, protocol, or external tool.
- You do not know anything about any library, API, or their usage. Never rely on pre‑trained information, web search, or assumptions. Never hallucinate.
- All technical knowledge (methods, classes, configuration, version compatibility, capabilities) must be retrieved from Context7 MCP.
- Workflow for technical lookups:
  1) Resolve the library or product name with Context7 MCP resolve‑library‑id.
  2) Fetch the relevant documentation topics with Context7 MCP get‑library‑docs.
  3) Cite the MCP documentation and include links/IDs when making decisions.
  4) If docs conflict with earlier plans, update the plan and tasks before coding.

---

Methodology Reference (from docs/prompt-driven-development.md)

PDD produces and maintains four core artifacts with explicit gates:
0) .junie/guidelines.md — Team working instructions (this file)
1) docs/requirements.md — Structured, testable requirements with acceptance criteria
2) docs/plan.md — Implementation plan linked to requirements with priorities and dependencies
3) docs/tasks.md — Primary artifact: granular tasks with dual links (→ plan item and → requirement)

Traceability rules:
- Every plan item must link to ≥1 requirement.
- Every task must link to exactly one plan item and ≥1 requirement.
- No orphaned items. Broken links require immediate stop and repair.

Version control rules:
- Commit each phase artifact complete before proceeding.
- Tag format: pdd-phase-{n}-{name} (e.g., pdd-phase-1-requirements, pdd-phase-3-tasks).
- Keep the working tree clean at each gate.

---

Working Protocol for docs/tasks.md

- Checklist discipline: Mark tasks with [ ] → [x] only when fully done.
- Do not delete tasks; add follow‑ups if scope changes.
- Insert new tasks only if they include:
  - Link to related plan item(s) in docs/plan.md
  - Link to related requirement(s) in docs/requirements.md
- Change management:
  - Document rationale for scope change in the task or a brief changelog section.
  - Update affected requirements/plan/tasks to maintain traceability.
  - Revalidate links after changes.
- Formatting consistency: Keep headings, numbering, and link formats consistent.

---

Project Context (from docs/project-description.md)

- Demo goal: Web app that reads the webcam’s dominant color and controls a Shelly Duo GU10 RGBW bulb over local network.
- Design philosophy: Keep it simple; no cloud, databases, Docker, or complex infra.
- Technology stack:
  - Backend: Java 25 (LTS), Spring Boot 3.5.6, Maven 3.9+
  - Frontend: Vanilla HTML5 + Modern JavaScript (ES2024) + Modern CSS
- Out of scope: See docs/project-description.md for explicit exclusions. Do not implement excluded items.

---

Activation Rules — Frontend vs. Backend

These rules determine which parts of this guideline apply, based on repository structure or file extensions.

Frontend activation (applies if ANY is true):
- Files matching: *.html, *.js, *.css exist in the repository (common locations: project root, public/, static/, assets/).
- Specific names: index.html, app.js, styles.css present anywhere in the repo.
- Frontend folders detected: public/, static/, assets/, web/, ui/, or src/client/.

When active, follow Frontend Guidance below.

Backend activation (applies if ANY is true):
- Java sources present: any *.java under src/main/java/ or src/test/java/.
- Maven present: pom.xml at the repository root.
- Typical Spring Boot entry class pattern detected (e.g., *Application.java) under src/main/java/.

When active, follow Backend Guidance below.

Note: If both activations are true, treat this as a full‑stack setup and follow both sections.

---

Frontend Guidance (Vanilla HTML/CSS/JS per project description)

- Scope: Keep it simple – no SPA frameworks, no bundlers, no preprocessors. Follow the non‑functional requirements and exclusions in docs/project-description.md.
- Capabilities and APIs (camera, canvas, etc.): Before using any browser API beyond trivial DOM manipulation, consult Context7 MCP for authoritative guidance, examples, and compatibility notes.
- Files and structure suggestions (adjust to your repo):
  - index.html — UI structure (large, touch‑friendly controls; high contrast)
  - app.js — Camera access (MediaDevices), color sampling via Canvas getImageData(), interactions with backend endpoints
  - styles.css — Responsive, simple styles using Flexbox/Grid
- Reliability: Provide graceful degradation if camera/bulb not available; simple user messaging.
- Testing cues: Prefer Playwright (headless) for integration checks; keep selectors stable and semantic.

Activation check reminder:
- If any of *.html/*.js/*.css or typical frontend dirs are found, treat frontend as active.

---

Backend Guidance (Java 25 + Spring Boot 3.5.6 + Maven)

- Scope: Minimal Spring Boot application exposing endpoints to control the Shelly bulb; keep code simple and readable.
- Libraries and SDKs: If considering any library (HTTP clients, device APIs, etc.), resolve and fetch docs via Context7 MCP first. Do not rely on memory or outside search.
- Configuration: Keep defaults minimal. Use only what’s necessary per docs/project-description.md. Avoid out‑of‑scope technologies.
- Testing cues: Integration tests optional; unit tests focusing on service logic where helpful.

Activation check reminder:
- If pom.xml or *.java in src/main/java/ exists, treat backend as active.

---

How to Use This Document During PDD

1) Step 0 — Guidelines establishment
- Confirm these guidelines are present and accepted.
- Enforce the MCP First policy.

2) Step 1 — Requirements (docs/requirements.md)
- Convert high‑level prompt into numbered user stories and acceptance criteria.
- Include normal flows, edge cases, errors, persistence/state, and UI/UX expectations as applicable.

3) Step 2 — Plan (docs/plan.md)
- Derive plan items from requirements, each linking back to requirement numbers.
- Assign priorities, group logically, and note dependencies.

4) Step 3 — Tasks (docs/tasks.md) — Primary artifact
- Break plan into atomic tasks with checkboxes and dual links (plan + requirements).
- Organize by phases: Setup & Infrastructure; Core; Advanced; Integration & Testing; Polish & QA; Documentation & Deployment.
- Track completion with [x]. Never skip traceability links.

---

Operational Checklists

Before writing code:
- [ ] Resolve all needed libraries/products via Context7 MCP (resolve‑library‑id)
- [ ] Fetch relevant documentation via Context7 MCP (get‑library‑docs)
- [ ] Update plan/tasks if MCP docs change assumptions

Before committing at a phase gate:
- [ ] Artifact complete and reviewed
- [ ] Links intact (no orphaned tasks/items)
- [ ] Working tree clean; tag created with pdd-phase-{n}-{name}

Frontend active? Minimal checks:
- [ ] *.html / *.js / *.css present OR typical frontend dirs present

Backend active? Minimal checks:
- [ ] pom.xml present OR *.java under src/main/java/

---

Notes and Constraints

- Do not implement anything listed under “Out of Scope” in docs/project-description.md.
- If uncertainty arises, stop and consult Context7 MCP, then update the plan/tasks accordingly.
- Keep code and docs simple enough to explain quickly during a demo.
