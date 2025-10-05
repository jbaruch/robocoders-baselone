---
inclusion: fileMatch
fileMatchPattern: "**/*.{html,js,css}"
---

# Frontend Development Guidelines

## Technology Stack

- **Core:** Vanilla HTML5 + Modern JavaScript (ES2024)
- **Color Detection:** Color Thief 2.4.0
- **Styling:** Modern CSS with CSS Grid/Flexbox

## Design Philosophy

**Intentionally prioritize simplicity** - NO frameworks, build tools, or complex infrastructure.

This is a 3-hour live conference demo designed to be visible from the back of a conference room.

## MANDATORY: Context7 MCP Usage

**ALWAYS consult Context7 MCP before writing any code.**

- You don't know anything about any library or API
- Never rely on pre-trained information
- Never search in other places
- Never hallucinate or assume
- All technical knowledge must come from Context7 MCP

Before implementing any JavaScript (ES2024), Color Thief, or browser API functionality, query Context7 MCP for accurate, up-to-date documentation.

## What NOT to Implement

The following are **explicitly excluded** to maintain simplicity:

- ❌ WebSocket client
- ❌ K-means clustering for color
- ❌ OffscreenCanvas
- ❌ Web Workers
- ❌ HSL/HSV conversions
- ❌ Kelvin temperature calculations
- ❌ Complex color science
- ❌ MediaStream constraints configuration
- ❌ Frontend frameworks (React, Vue, Angular)
- ❌ Build tools (Webpack, Vite)
- ❌ CSS preprocessors (Sass, Less)

## UI Requirements

### Usability
- **Zero configuration** for end user
- **Large, touch-friendly buttons** (50px+ height minimum)
- **High contrast** for visibility from distance
- Simple, intuitive controls

### Reliability
- Graceful degradation if bulb offline
- Auto-reconnect camera if stream drops
- No crashes on invalid camera selection
- Clear error messages

## File Generation Order

1. `index.html` - UI structure
2. `app.js` - Client logic
3. `styles.css` - Styling

## Code Style Preferences

- Use modern JavaScript (ES2024) features
- Use `const` and `let` (no `var`)
- Use arrow functions where appropriate
- Keep functions focused and under 20 lines
- Use meaningful variable names
- Add comments only for non-obvious logic

## Common Pitfalls to Avoid

- Don't overcomplicate camera selection (basic dropdown is fine)
- Don't add complex color algorithms (Color Thief is sufficient)
- Don't optimize prematurely (code clarity > performance)
- Don't add unnecessary animations or transitions
- Keep the UI simple and functional

## Testing Strategy

### Integration Testing (Primary via Playwright)
- [ ] Camera selection dropdown populates
- [ ] Video stream displays from selected camera
- [ ] Color preview updates continuously
- [ ] Manual mode: send button works
- [ ] Auto mode: color sends every 3 seconds
- [ ] Bulb actually changes color
- [ ] Error messages display on network failure
- [ ] App works on Chrome, Firefox, Safari

## Acceptance Criteria

The frontend is successful if:
- ✅ Webcam activates without manual permission prompts
- ✅ Color preview visibly updates in real-time
- ✅ Manual send changes bulb color within 2 seconds
- ✅ Auto mode sends color every 3 seconds reliably
- ✅ UI is large enough to see from back of conference room
- ✅ No crashes or exceptions during demo
- ✅ Works in modern browsers (Chrome, Firefox, Safari)
