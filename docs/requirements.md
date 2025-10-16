# RGBW Control App — Requirements (PDD Step 1)

Source basis: docs/project-description.md (PRD). This document formalizes user stories and testable acceptance criteria to guide planning and implementation. It also enumerates edge cases, error handling, state, UI/UX behaviors, and scope boundaries.

Note: Per Prompt-Driven Development (docs/prompt-driven-development.md), this artifact must be reviewed and approved before planning or coding proceeds.

## 1. Terminology
- Shelly Duo GU10 RGBW: a local‑network smart bulb (Gen1, HTTP endpoints) to be controlled.
- App: The demo web application comprised of a Spring Boot backend and a vanilla HTML/JS/CSS frontend.
- Presenter/Operator: The person running the demo.

## 2. Technology Constraints (from PRD, made normative)
- Backend: Java 25 (LTS), Spring Boot 3.5.6, Maven 3.9+.
- Frontend: Vanilla HTML5 + Modern JavaScript (ES2024) + Modern CSS (Flexbox/Grid).
- Simplicity first: No cloud, databases, Docker, or complex infra.
- Use Spring’s RestClient (not RestTemplate). No @EnableWebMvc.
- Shelly API generation: Gen1 simple HTTP GET endpoints (not RPC).

## 3. Out of Scope (do NOT implement)
The following are explicitly excluded to maintain simplicity (see PRD for rationale):
- Backend: WebSockets, Resilience4j/circuit breakers, connection pools, Actuator, metrics, Redis, any database, Docker, MQTT, AuthN/Z, rate limiting, logging frameworks beyond defaults.
- Frontend: WebSocket client, K‑means clustering, OffscreenCanvas, Web Workers, HSL/HSV conversions, Kelvin temperature calculations, complex color science, MediaStream constraints tuning, any SPA framework, bundlers, or CSS preprocessors.

## 4. User Stories and Requirements

R1. As a presenter, I want to start the backend with a single command so that I can demo quickly.
- Acceptance:
  - WHEN I run `mvn spring-boot:run` THEN the backend SHALL start without additional setup.
  - WHEN the app starts THEN it SHALL bind to default port (8080) unless overridden by standard Spring configuration.

R2. As a presenter, I want an HTTP endpoint to set the bulb’s RGBW color so that I can change the light live during the demo.
- Acceptance:
  - WHEN a client POSTs JSON to `/api/color` with channels in [0..255] THEN the backend SHALL translate this into Shelly Gen1 HTTP request(s) to set color.
  - WHEN the request is valid THEN the backend SHALL respond 200 with a concise JSON result including the applied values and a status message.
  - WHEN any channel is out of range or payload invalid THEN the backend SHALL respond 400 with an explanatory message.
  - WHEN the bulb is unreachable or times out THEN the backend SHALL respond 502/504 with an explanatory message.

R3. As a presenter, I want the bulb IP to be configurable outside of code so that the same build works on different networks.
- Acceptance:
  - WHEN `application.properties` or environment variables are provided (e.g., `SHELLY_IP`), THEN the backend SHALL use that IP without code changes.
  - WHEN the IP is not configured THEN the backend SHALL reject color‑send requests with 503 and a clear error explaining configuration is missing.

R4. As a presenter, I want a simple web page that shows my camera feed and dominant color so that I can pick a color with physical objects or clothing.
- Acceptance:
  - WHEN the page loads and I grant permission THEN a video element SHALL display the live camera feed.
  - WHEN the feed is active THEN the app SHALL compute and display a continuously updating color preview (square) derived from the frame’s dominant color using Canvas `getImageData()`.
  - WHEN multiple cameras are available THEN a dropdown SHALL list them and allow switching.

R5. As a presenter, I want to manually send the current color to the bulb so that I can control the demo.
- Acceptance:
  - WHEN I click a "Send Color" button THEN the app SHALL call the backend `/api/color` and reflect success or error to the user.
  - WHEN successful THEN the bulb change SHALL be visible within 2 seconds.

R6. As a presenter, I want an "Auto" mode so that colors send periodically during the demo.
- Acceptance:
  - WHEN Auto mode is enabled THEN the app SHALL send the current color every 3 seconds.
  - WHEN Auto mode is disabled THEN no periodic sends SHALL occur.

R7. As an audience member, I need the UI to be readable from a distance so that I can follow along.
- Acceptance:
  - Buttons and controls SHALL be large (≥50px height) and high contrast.
  - The layout SHALL be responsive and usable on laptop displays and external projectors.

R8. As a presenter, I want the app to be robust so that the demo doesn’t fail due to transient issues.
- Acceptance:
  - WHEN the camera stream drops THEN the app SHALL attempt to re‑acquire the stream automatically and inform the user.
  - WHEN the bulb is offline/unreachable THEN the app SHALL show a clear, non‑blocking error and allow retry.
  - WHEN no camera devices are available or permission is denied THEN the app SHALL display a helpful message and keep the UI functional where possible.

R9. As a developer, I want the code to be simple and idiomatic so that it’s easy to explain.
- Acceptance:
  - Backend SHALL use records for DTOs, constructor injection, methods < 20 lines when reasonable, and meaningful names.
  - No unnecessary configuration: rely on Spring Boot autoconfiguration; do not add `@EnableWebMvc`.
  - Use Spring’s RestClient for outbound HTTP.

R10. As a tester, I want a minimal testability baseline so that we can verify key flows.
- Acceptance:
  - Integration checks (manual or automated) SHALL confirm: camera dropdown populated; video stream displays; color preview updates; manual send works; auto sends every 3s; bulb changes color; errors are shown on network failure.
  - Optional unit tests MAY mock RestClient in `ShellyBulbService` and validate `ColorController` request/response mapping.

## 5. Data Contracts (DTOs)
- ColorRequest (record): `{ r:int, g:int, b:int, w:int }` with each channel 0..255.
- ColorResponse (record): `{ status:string, r:int, g:int, b:int, w:int, message?:string }`.

Validation Rules:
- r,g,b,w required; integers 0..255. Reject otherwise with 400.

## 6. Backend Behavior
- Endpoint: `POST /api/color` accepts `application/json` → ColorRequest; returns ColorResponse.
- Configuration:
  - Property key: `shelly.ip` (or env var `SHELLY_IP`). If missing → 503 with message.
- Shelly Integration (Gen1 HTTP GET):
  - Translate RGBW to Shelly’s expected parameters via HTTP GET to the bulb IP.
  - Timeouts: outbound request timeout ≤ 2s to support demo responsiveness.
  - Errors: Map network/timeout to 502/504; include concise diagnostic message.

## 7. Frontend Behavior
- Index page provides:
  - Camera selection dropdown; current camera label.
  - Live video preview; high‑contrast color preview swatch.
  - Buttons: "Send Color" and an Auto mode toggle (clearly visible, ≥50px height).
- Color sampling:
  - Use Canvas 2D `getImageData()` on the video frame at an interval (e.g., 10–15 FPS sampling) to compute a simple average color (no clustering, per Out‑of‑Scope).
- Networking:
  - Send color to `/api/color` via fetch; display success/error toast or inline message.
- Progressive behavior:
  - If camera permission denied or no devices → show an explanatory message and keep manual controls available (with last known color).

## 8. Error Handling & Messages
- 400: Invalid payload → "Color channels must be integers 0..255".
- 503: Bulb IP not configured → "Bulb IP not configured. Set shelly.ip or SHELLY_IP.".
- 502/504: Upstream failure/timeout → "Failed to reach bulb. Check power/IP and try again.".
- Frontend: Non‑modal, high‑contrast banners or inline messages that do not block other actions.

## 9. State & Persistence
- No server‑side persistence.
- Frontend MAY remember last selected camera deviceId and Auto mode in localStorage for convenience. If unavailable, app continues without it.

## 10. Performance & Timing
- Manual send round‑trip visible on bulb within 2 seconds under normal conditions.
- Auto mode interval: 3 seconds ± 250ms.
- Color sampling: target 10–15 FPS (best effort; do not over‑optimize).

## 11. Accessibility & UX
- Controls ≥50px height; high contrast; keyboard accessible where reasonable.
- Clear labels for camera, preview, and actions.

## 12. Acceptance Checklist (from PRD; to be verified later)
- [ ] App runs with `mvn spring-boot:run`.
- [ ] Webcam activates (after permission) and displays.
- [ ] Color preview updates continuously.
- [ ] Manual send works.
- [ ] Auto mode sends every 3 seconds.
- [ ] Bulb changes color accordingly.
- [ ] Errors shown on network failure.
- [ ] Works on Chrome, Firefox, Safari (best effort for a demo).

## 13. Compliance
- All items above SHALL be implemented without introducing Out‑of‑Scope features.
- Library/API usage SHALL consult Context7 MCP before coding to ensure accurate configuration and calls.

— End of PDD Step 1. Please review and approve before we proceed to planning (docs/plan.md).