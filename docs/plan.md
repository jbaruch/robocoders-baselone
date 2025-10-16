# RGBW Control App — Implementation Plan (PDD Step 2)

This plan derives from the approved requirements in docs/requirements.md. Each plan item lists linked requirement IDs, a priority, and dependencies. Proceed only after this plan is approved (PDD gate).

Legend: Priority = H/M/L; Depends → item numbers.

## Plan Items

1. Project Bootstrap (Backend foundation)
- Scope: Create Maven Spring Boot project (Java 25), minimal main application class.
- Links: R1, R9
- Priority: H
- Depends: —

2. Configuration Externalization for Bulb IP
- Scope: Add `application.properties` with `shelly.ip` using env override (e.g., `SHELLY_IP`); basic config validation behavior.
- Links: R3, R8
- Priority: H
- Depends: 1

3. Data Contracts (DTOs)
- Scope: Implement records ColorRequest and ColorResponse with validation bounds [0..255].
- Links: R2, R5, R9
- Priority: H
- Depends: 1

4. ShellyBulbService (Outbound HTTP via RestClient)
- Scope: Configure RestClient; implement method to translate RGBW to Shelly Gen1 HTTP GET; set sensible timeouts (~2s); map errors to domain results.
- Links: R2, R8, R10
- Priority: H
- Depends: 2, 3

5. ColorController (REST API)
- Scope: Expose POST `/api/color`; validate input; handle error mapping (400/503/502/504); return ColorResponse.
- Links: R2, R5, R8, R9
- Priority: H
- Depends: 3, 4

6. Frontend: index.html Structure
- Scope: Basic layout with camera dropdown, video preview, color swatch, Send button, Auto toggle; high‑contrast, large controls.
- Links: R4, R5, R6, R7, R11
- Priority: H
- Depends: — (can be built in parallel)

7. Frontend: app.js Logic
- Scope: Camera selection via MediaDevices; start/restore stream; compute average color via Canvas getImageData; manual send to `/api/color`; auto mode timer (3s); error messaging; basic state in localStorage.
- Links: R4, R5, R6, R8, R10
- Priority: H
- Depends: 6, 5 (for endpoint integration)

8. Frontend: styles.css
- Scope: Responsive layout; large (≥50px) controls; high contrast; simple grid/flex.
- Links: R7, R11
- Priority: M
- Depends: 6

9. Run & Verify (Acceptance Pass)
- Scope: Start backend; open UI; verify end‑to‑end behavior against Acceptance Checklist; use provided bulb IP.
- Links: R1–R8, R10–R12
- Priority: H
- Depends: 1–8

10. Minimal Tests (Optional for Demo)
- Scope: Add unit tests for ShellyBulbService (mock RestClient) and ColorController mapping if time permits.
- Links: R10
- Priority: L
- Depends: 4, 5

## Notes
- Strictly avoid Out‑of‑Scope items from PRD.
- Before any coding that involves libraries/APIs (Spring Boot, RestClient, MediaDevices/Canvas), consult Context7 MCP and update tasks if findings affect approach.
