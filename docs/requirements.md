# Vibecoding Demo: RGBW Control App PRD

## Project Overview

**Goal**: Build a web app that uses webcam feed to detect dominant color and control a Shelly Duo GU10 RGBW smart bulb over local network.

**Demo Context**: 1-hour live conference demo using agentic AI IDEs (Windsurf, Cursor, etc.)

**Design Philosophy**: Intentionally prioritize simplicity - NO cloud, databases, Docker, or complex infrastructure.

---

## Technology Stack

### Backend
- **Java**: 25 (LTS, released September 2025)
- **Spring Boot**: 3.5.6 (latest stable)
- **Build Tool**: Maven 3.9+
- **Key Dependencies**:
  ```xml
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.6</version>
  </parent>
  
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
  </dependencies>
  ```

### Frontend
- **Core**: Vanilla HTML5 + Modern JavaScript (ES2024)
- **Color Detection**: [Color Thief 2.4.0](https://github.com/lokesh/color-thief) via CDN
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.4.0/color-thief.min.js"></script>
  ```
- **Styling**: Modern CSS with CSS Grid/Flexbox

---

## Project Structure

```
vibecoding-demo/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/demo/vibecoding/
│   │   │       ├── VibeCodingApplication.java
│   │   │       ├── controller/
│   │   │       │   └── ColorController.java
│   │   │       ├── service/
│   │   │       │   └── ShellyBulbService.java
│   │   │       ├── model/
│   │   │       │   ├── ColorRequest.java
│   │   │       │   └── ColorResponse.java
│   │   │       └── config/
│   │   │           └── WebConfig.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   │           ├── index.html
│   │           ├── styles.css
│   │           └── app.js
│   └── test/
│       └── java/
│           └── com/demo/vibecoding/
│               └── VibeCodingApplicationTests.java
└── README.md
```

---

## Backend Requirements

### 1. Main Application Class
**File**: `VibeCodingApplication.java`
```java
@SpringBootApplication
public class VibeCodingApplication {
    public static void main(String[] args) {
        SpringApplication.run(VibeCodingApplication.class, args);
    }
}
```

### 2. Configuration
**File**: `application.properties`
```properties
# Server Configuration
server.port=8080

# Shelly Bulb Configuration
shelly.bulb.ip=192.168.1.42
shelly.bulb.timeout=5000

# CORS Configuration (for local development)
cors.allowed.origins=http://localhost:8080
```

### 3. Model Classes

**File**: `ColorRequest.java`
```java
public record ColorRequest(
    @Min(0) @Max(255) int red,
    @Min(0) @Max(255) int green,
    @Min(0) @Max(255) int blue
) {}
```

**File**: `ColorResponse.java`
```java
public record ColorResponse(
    boolean success,
    String message,
    int red,
    int green,
    int blue,
    int white
) {}
```

### 4. REST Controller

**File**: `ColorController.java`

**Endpoint**: `POST /api/color`

**Request Body**:
```json
{
  "red": 120,
  "green": 80,
  "blue": 200
}
```

**Response**:
```json
{
  "success": true,
  "message": "Color updated successfully",
  "red": 120,
  "green": 80,
  "blue": 200,
  "white": 80
}
```

**Requirements**:
- Accept `ColorRequest` with validation
- Call `ShellyBulbService` to update bulb
- Return `ColorResponse` with result
- Handle exceptions with appropriate HTTP status codes
- Use `@RestController` and `@RequestMapping`

### 5. Shelly Service

**File**: `ShellyBulbService.java`

**Responsibilities**:
- Use Spring's `RestClient` (new in Spring Boot 3.x)
- Build Shelly API URL with query parameters
- Calculate white value: `white = min(red, green, blue)`
- Set `gain=100` and `turn=on`
- Handle connection timeouts (5 seconds)
- Log requests and responses

**Shelly API Format**:
```
http://{bulb-ip}/light/0?turn=on&red={r}&green={g}&blue={b}&white={w}&gain=100
```

**Implementation Notes**:
- Inject bulb IP from `application.properties` using `@Value`
- Use `RestClient` configured with timeout
- Return boolean success status
- Catch and log exceptions (don't throw to controller)

### 6. Web Configuration

**File**: `WebConfig.java`

**Requirements**:
- Configure CORS for local development
- Allow POST requests from frontend origin
- Enable credentials if needed

---

## Frontend Requirements

### 1. HTML Structure

**File**: `index.html`

**Layout Requirements**:
- Full-screen responsive design optimized for projector/large screen
- Large, clearly visible UI components
- Clean, modern aesthetic

**Required Elements**:
```html
<!-- Webcam Selection -->
<select id="cameraSelect">
  <option value="">Select Camera...</option>
</select>

<!-- Webcam Video -->
<video id="webcam" autoplay playsinline></video>

<!-- Color Preview Box -->
<div id="colorPreview"></div>

<!-- Mode Toggle -->
<div class="mode-toggle">
  <label>
    <input type="radio" name="mode" value="manual" checked> Manual
  </label>
  <label>
    <input type="radio" name="mode" value="auto"> Auto
  </label>
</div>

<!-- Send Button (enabled only in manual mode) -->
<button id="sendButton" disabled>Send to Bulb</button>

<!-- Status Display -->
<div id="status"></div>
```

### 2. JavaScript Implementation

**File**: `app.js`

**Core Functions**:

```javascript
// 1. Camera Management
async function listCameras()
// Populate dropdown with available devices

async function startCamera(deviceId)
// Initialize video stream with selected device

// 2. Color Detection
function extractColor()
// Use Color Thief to get dominant RGB from video
// Return {r, g, b} object

// 3. Mode Management
let mode = 'manual'; // or 'auto'
let autoInterval = null;

function handleModeChange()
// Toggle between manual/auto
// Start/stop 3-second interval for auto mode

// 4. API Communication
async function sendColorToBulb(r, g, b)
// POST to /api/color
// Update status display
// Handle errors gracefully

// 5. Auto Mode Timer
function startAutoMode()
// Extract color every 3 seconds
// Send to bulb automatically

function stopAutoMode()
// Clear interval
```

**Event Handlers**:
- Camera selection change → restart video stream
- Mode toggle → enable/disable send button, start/stop auto timer
- Send button click → extract and send color
- Video stream load → start detecting color for preview

### 3. CSS Styling

**File**: `styles.css`

**Design Requirements**:
- **Large Scale**: Minimum font-size 18px, buttons 24px+
- **High Contrast**: Excellent visibility for projection
- **Color Preview**: Large square (200px+) showing current detected color
- **Modern Look**: CSS Grid layout, smooth transitions, rounded corners
- **Responsive**: Works on desktop (primary) and tablet
- **Status Feedback**: Clear visual feedback for sending/errors

**Key Components**:
```css
/* Full-screen container */
.container {
  display: grid;
  height: 100vh;
  padding: 2rem;
  gap: 2rem;
}

/* Large color preview box */
#colorPreview {
  width: 250px;
  height: 250px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

/* Prominent toggle buttons */
.mode-toggle label {
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

/* Large send button */
#sendButton {
  padding: 1.5rem 3rem;
  font-size: 1.75rem;
  border-radius: 12px;
}
```

---

## Shelly Integration Specifications

### API Endpoint
```
GET http://{bulb-ip}/light/0
```

### Query Parameters
| Parameter | Type | Range | Required | Description |
|-----------|------|-------|----------|-------------|
| `turn` | string | on/off | Yes | Turn light on/off |
| `red` | integer | 0-255 | Yes | Red channel |
| `green` | integer | 0-255 | Yes | Green channel |
| `blue` | integer | 0-255 | Yes | Blue channel |
| `white` | integer | 0-255 | Yes | White channel |
| `gain` | integer | 0-100 | Yes | Brightness (use 100) |

### White Channel Calculation
```
white = Math.min(red, green, blue)
```
**Rationale**: Reduces color saturation by adding white component equal to the minimum RGB value.

### Example Request
```
http://192.168.1.42/light/0?turn=on&red=120&green=80&blue=200&white=80&gain=100
```

### **DO NOT USE**:
- `/white/0` endpoint
- `/color/0` endpoint  
- Advanced features (effects, transitions, etc.)

---

## Functional Requirements

### User Stories

**US-1**: As a user, I can select from available webcams
- **AC1**: Dropdown populated on page load
- **AC2**: Default camera selected automatically
- **AC3**: Camera switch takes effect immediately

**US-2**: As a user, I can see the detected color in real-time
- **AC1**: Color preview updates continuously while camera is active
- **AC2**: RGB values displayed numerically
- **AC3**: Preview box shows actual detected color

**US-3**: As a user, I can manually send color to bulb
- **AC1**: Send button enabled only in manual mode
- **AC2**: Button click extracts current color and sends to bulb
- **AC3**: Status message confirms success/failure

**US-4**: As a user, I can enable auto mode
- **AC1**: Toggle to auto mode starts 3-second interval
- **AC2**: Send button becomes disabled in auto mode
- **AC3**: Color automatically sent every 3 seconds
- **AC4**: Toggle back to manual stops auto sending

**US-5**: As a user, I receive feedback on actions
- **AC1**: Status area shows "Sending..." during API call
- **AC2**: Success message shows "Color updated!"
- **AC3**: Error message shows clear description if fails
- **AC4**: Loading states prevent duplicate requests

---

## Error Handling

### Backend Errors
1. **Validation Error** (400)
   - RGB values out of range
   - Missing required fields

2. **Connection Timeout** (504)
   - Bulb unreachable
   - Network error

3. **Server Error** (500)
   - Unexpected exception
   - Invalid bulb IP

### Frontend Errors
1. **Camera Access Denied**
   - Show clear message asking for permission
   - Provide troubleshooting steps

2. **No Cameras Found**
   - Display message: "No cameras detected"
   - Suggest checking browser permissions

3. **API Request Failed**
   - Display error message from server
   - Don't crash the app - allow retry

---

## Non-Functional Requirements

### Performance
- Camera stream: 30fps minimum
- Color extraction: < 100ms
- API response: < 1 second (including network)

### Usability
- Zero configuration for end user
- Large, touch-friendly buttons (50px+ height)
- High contrast for visibility from distance

### Reliability
- Graceful degradation if bulb offline
- Auto-reconnect camera if stream drops
- No crashes on invalid camera selection

---

## Out of Scope (DO NOT IMPLEMENT)

The following are explicitly **excluded** to maintain simplicity:

### Backend
- ❌ WebSocket connections
- ❌ Circuit breakers (Resilience4j)
- ❌ Connection pooling configuration
- ❌ Actuator endpoints
- ❌ Prometheus metrics
- ❌ Redis caching
- ❌ Database (PostgreSQL, H2, etc.)
- ❌ Docker containerization
- ❌ MQTT protocol
- ❌ Authentication/Authorization
- ❌ Rate limiting
- ❌ Logging frameworks beyond SLF4J default

### Frontend
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

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Camera selection dropdown populates
- [ ] Video stream displays from selected camera
- [ ] Color preview updates continuously
- [ ] Manual mode: send button works
- [ ] Auto mode: color sends every 3 seconds
- [ ] Bulb actually changes color
- [ ] Error messages display on network failure
- [ ] App works on Chrome, Firefox, Safari

### Unit Tests (Optional for Demo)
- `ShellyBulbService`: Mock RestClient calls
- `ColorController`: Test request/response mapping

---

## Demo Flow

**Pre-Demo Setup** (5 minutes before):
1. Ensure Shelly bulb is powered and on network
2. Confirm bulb IP in `application.properties`
3. Start Spring Boot app: `mvn spring-boot:run`
4. Open browser to `http://localhost:8080`
5. Test camera permissions

**Live Demo Script** (10 minutes):
1. **Introduce Project** (1 min)
   - Show app on screen
   - Explain concept: webcam → color → smart bulb

2. **Camera Selection** (1 min)
   - Select camera from dropdown
   - Show video feed

3. **Manual Mode** (3 min)
   - Show color preview updating
   - Hold colored object to camera (red, blue, green)
   - Click "Send to Bulb"
   - Watch bulb change color

4. **Auto Mode** (3 min)
   - Toggle to auto mode
   - Move colored objects in front of camera
   - Show bulb responding every 3 seconds

5. **Show Code** (2 min)
   - Quick tour of `ColorController`
   - Show `ShellyBulbService` RestClient usage
   - Highlight simplicity of implementation

---

## Quick Start Commands

### Prerequisites
```bash
java -version  # Should show Java 25
mvn -version   # Should show Maven 3.9+
```

### Build & Run
```bash
# Clone/create project
mvn spring-boot:run

# Access app
open http://localhost:8080
```

### Configuration
Edit `src/main/resources/application.properties`:
```properties
shelly.bulb.ip=<YOUR_BULB_IP>
```

---

## Acceptance Criteria

**The demo is successful if**:
- ✅ App runs with single `mvn spring-boot:run` command
- ✅ Webcam activates without manual permission prompts
- ✅ Color preview visibly updates in real-time
- ✅ Manual send changes bulb color within 2 seconds
- ✅ Auto mode sends color every 3 seconds reliably
- ✅ UI is large enough to see from back of conference room
- ✅ No crashes or exceptions during demo
- ✅ Code is simple enough to explain in 5 minutes

---

## Additional Notes for AI Agents

### File Generation Order
1. `pom.xml` - Dependencies first
2. `application.properties` - Configuration
3. Model classes - Simple records
4. `ShellyBulbService` - Core logic
5. `ColorController` - REST endpoint
6. `VibeCodingApplication` - Main class
7. `index.html` - UI structure
8. `app.js` - Client logic
9. `styles.css` - Styling

### Common Pitfalls to Avoid
- Don't use `@EnableWebMvc` (breaks Spring Boot auto-config)
- Don't configure `RestTemplate` (use `RestClient` instead)
- Don't add complex exception handling (keep it simple)
- Don't overthink camera selection (basic dropdown is fine)
- Don't optimize prematurely (code clarity > performance)

### Code Style Preferences
- Use records for DTOs (ColorRequest, ColorResponse)
- Use constructor injection (no field injection)
- Keep methods under 20 lines
- Use meaningful variable names
- Add comments only for non-obvious logic

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Oct 2025 | Updated to Java 25, Spring Boot 3.5.6, agent-optimized |
| 1.0 | Original | Java 21, Spring Boot 3.5 baseline |