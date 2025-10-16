# RGBW Control App — Tasks (PDD Step 3)

Primary artifact for Prompt-Driven Development. Each task links to exactly one plan item and one or more requirements. Use [ ] → [x] only when fully done. Do not delete tasks; add follow‑ups if scope changes. Keep formatting consistent.

Link format examples: (→ Plan 3; → Req R2, R9)

## Phase A — Setup & Infrastructure

- [x] Create docs/requirements.md and get approval (gate). (→ Plan —; → Req —)
- [x] Create docs/plan.md and get approval (gate). (→ Plan —; → Req R1–R12)
- [x] Create docs/tasks.md and get approval (gate). (→ Plan —; → Req R1–R12)

## Phase B — Core Backend

- [x] Initialize Maven Spring Boot project (Java 25), main application class. (→ Plan 1; → Req R1, R9)
- [x] Add application.properties with shelly.ip and env override; fail fast on missing config for color route. (→ Plan 2; → Req R3, R8)
- [x] Implement records: ColorRequest, ColorResponse; add input validation. (→ Plan 3; → Req R2, R5, R9)
- [x] Implement ShellyBulbService using Spring RestClient with ~2s timeouts and error mapping. (→ Plan 4; → Req R2, R8, R10)
- [ ] Implement ColorController: POST /api/color with proper responses (200/400/503/502/504). (→ Plan 5; → Req R2, R5, R8, R9)

## Phase C — Core Frontend

- [x] Create index.html with layout: camera select, video, color swatch, Send, Auto toggle. (→ Plan 6; → Req R4, R5, R6, R7, R11)
- [x] Create app.js: getUserMedia, enumerate devices, average color via Canvas, manual send, auto mode, error banners. (→ Plan 7; → Req R4, R5, R6, R8, R10)
- [x] Create styles.css: responsive layout, ≥50px controls, high contrast. (→ Plan 8; → Req R7, R11)

## Phase D — Integration & Testing

- [ ] Provide instructions or script to run backend; verify UI loads and endpoints reachable. (→ Plan 9; → Req R1)
- [ ] Verify camera dropdown, video stream, color preview updates. (→ Plan 9; → Req R4)
- [ ] Verify manual send works; bulb changes color within 2 seconds (using provided IP). (→ Plan 9; → Req R5)
- [ ] Verify auto mode sends every 3 seconds. (→ Plan 9; → Req R6)
- [ ] Verify graceful errors when bulb offline/unreachable. (→ Plan 9; → Req R8)
- [ ] Cross‑browser sanity checks (Chrome/Firefox/Safari, best effort). (→ Plan 9; → Req R12)

## Phase E — Optional Tests

- [ ] Unit test ShellyBulbService with mocked RestClient. (→ Plan 10; → Req R10)
- [ ] Unit test ColorController mapping/validation. (→ Plan 10; → Req R10)

## Phase F — Polish & QA

- [ ] Review code for simplicity and idiomatic style; ensure records/constructor injection; methods under ~20 lines. (→ Plan 9; → Req R9)
- [ ] UI accessibility pass: contrast, sizes, keyboard nav. (→ Plan 9; → Req R7, R11)

## Phase G — Documentation & Delivery

- [ ] Update README with run instructions and configuration notes (shelly.ip / SHELLY_IP). (→ Plan 9; → Req R1, R3)
- [ ] Final acceptance check against checklist in requirements. (→ Plan 9; → Req R12)
