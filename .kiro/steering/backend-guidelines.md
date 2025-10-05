---
inclusion: fileMatch
fileMatchPattern: "**/*.java"
---

# Backend Development Guidelines

## Technology Stack

- **Java:** 25 (LTS, released September 2025)
- **Spring Boot:** 3.5.6 (latest stable)
- **Build Tool:** Maven 3.9+

## Design Philosophy

**Intentionally prioritize simplicity** - NO cloud, databases, Docker, or complex infrastructure.

This is a 3-hour live conference demo. Code clarity and reliability trump optimization.

## MANDATORY: Context7 MCP Usage

**ALWAYS consult Context7 MCP before writing any code.**

- You don't know anything about any library or API
- Never rely on pre-trained information
- Never search in other places
- Never hallucinate or assume
- All technical knowledge must come from Context7 MCP

Before implementing any Spring Boot, Java 25, or Maven functionality, query Context7 MCP for accurate, up-to-date documentation.

## What NOT to Implement

The following are **explicitly excluded** to maintain simplicity:

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

## Code Style Preferences

- **Use records for DTOs** (ColorRequest, ColorResponse)
- **Use constructor injection** (no field injection)
- **Keep methods under 20 lines**
- **Use meaningful variable names**
- **Add comments only for non-obvious logic**

## Common Pitfalls to Avoid

- Don't use `@EnableWebMvc` (breaks Spring Boot auto-config)
- Don't configure `RestTemplate` (use `RestClient` instead)
- Don't add complex exception handling (keep it simple)
- Don't optimize prematurely (code clarity > performance)
- Hardcoded bulb IP will probably be wrong - **ask for real IP before testing**

## File Generation Order

1. `pom.xml` - Dependencies first
2. `application.properties` - Configuration
3. Model classes - Simple records
4. `ShellyBulbService` - Core logic
5. `ColorController` - REST endpoint
6. `VibeCodingApplication` - Main class

## Testing Strategy

### Integration Testing (Primary)
- Use Playwright for headless browser testing
- Test actual bulb color changes
- Verify error handling on network failure

### Unit Tests (Optional for Demo)
- `ShellyBulbService`: Mock RestClient calls
- `ColorController`: Test request/response mapping

## Acceptance Criteria

The backend is successful if:
- ✅ Runs with single `mvn spring-boot:run` command
- ✅ REST endpoint responds within 2 seconds
- ✅ Graceful degradation if bulb offline
- ✅ No crashes or exceptions during demo
- ✅ Code is simple enough to explain in 5 minutes
