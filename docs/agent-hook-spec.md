# Agent Hook Specification: Auto-Generate Tests from Gherkin Features

## Kiro Hook Setup

**Use this when creating the hook in Kiro:**

**Hook Name:** `auto-generate-tests-from-gherkin`

**Trigger:** On file save

**File Pattern:** `docs/features/*.feature`

**Agent Instructions:**
```
Read #[[file:docs/agent-hook-spec.md]] for complete instructions.

Generate executable tests from the saved Gherkin feature file following all rules in the spec.

MANDATORY: Consult Context7 MCP before writing ANY test code.
```

---

## Hook Configuration Details

**Trigger:** File save event

**File Pattern:** `docs/features/*.feature`

**Description:** Automatically generate executable tests from Gherkin feature files following IIC Phase 2 completion

**Context Files:** The hook agent should read these files for complete instructions:
- `#[[file:docs/agent-hook-spec.md]]` - This specification (complete hook behavior and rules)
- `#[[file:.kiro/steering/iic-methodology.md]]` - IIC methodology and phase context
- `#[[file:docs/requirements.md]]` - Project requirements and constraints
- The triggering feature file: `docs/features/[filename].feature`

---

## Hook Behavior

When any `docs/features/*.feature` file is saved, this hook should:

1. **Read and parse** the Gherkin feature file
2. **Extract tags** to determine test type and component
3. **Consult Context7 MCP** for accurate library/framework documentation before generating any test code
4. **Generate executable tests** based on Gherkin scenarios
5. **Place tests** in appropriate directories based on tags
6. **Create traceability links** mapping each test back to its Gherkin scenario
7. **Update** `docs/progress.md` with test generation status

---

## Input Format: Gherkin Feature Files

The hook expects feature files in `docs/features/*.feature` to follow proper Gherkin syntax:

```gherkin
# docs/features/color-control.feature

Feature: Color Control
  As a user
  I want to send colors to the smart bulb
  So that I can control the bulb color from webcam feed

  @unit @component:ColorController
  Scenario: Send valid RGB color
    Given a valid RGB color with values 255, 0, 0
    When I send a POST request to /api/color
    Then the response status should be 200
    And the bulb should receive the color command

  @integration @component:ShellyBulbService
  Scenario: Handle bulb offline
    Given the Shelly bulb is offline
    When I send a color command
    Then the service should return an error
    And the error message should indicate bulb unavailable

  @e2e @component:WebcamColorDetection
  Scenario: Detect and send color from webcam
    Given the webcam is active
    And the video stream is displaying
    When a red object appears in the frame
    Then the dominant color should be detected as red
    And the color should be sent to the bulb automatically
```

### Required Elements per Feature File

- **Feature:** High-level feature description with user story (As a/I want/So that)
- **Scenario:** Individual test scenario with descriptive name
- **Given/When/Then/And/But:** Gherkin steps defining the test
- **Tags:** Required tags for test generation:
  - Test type tag: `@unit`, `@integration`, or `@e2e`
  - Component tag: `@component:[ComponentName]` (determines test file location)

### Gherkin Syntax Rules

- Use proper Gherkin keywords: `Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, `But`
- Tags must start with `@` and appear before the scenario
- Steps should be clear, atomic, and testable
- Use `Scenario Outline` with `Examples` for data-driven tests (optional)
- Background steps can be used for common setup (optional)

---

## Output: Test File Generation

### Backend Tests (Java/Spring Boot)

**Test Type: unit**
- Location: `src/test/java/[package]/[Component]Test.java`
- Framework: JUnit 5 + Mockito
- Naming: `test[ScenarioName]()`

**Test Type: integration**
- Location: `src/test/java/[package]/[Component]IntegrationTest.java`
- Framework: JUnit 5 + Spring Boot Test
- Annotations: `@SpringBootTest`, `@AutoConfigureMockMvc`

**Test Type: e2e**
- Location: `src/test/java/[package]/e2e/[Feature]E2ETest.java`
- Framework: Playwright for Java
- Full application context

### Frontend Tests (JavaScript)

**Test Type: unit**
- Location: `src/test/[component].test.js`
- Framework: Jest or Vitest (check project config)

**Test Type: integration**
- Location: `src/test/integration/[component].integration.test.js`
- Framework: Jest/Vitest with DOM testing

**Test Type: e2e**
- Location: `tests/e2e/[feature].spec.js`
- Framework: Playwright
- Browser automation

---

## Test Generation Rules

### MANDATORY: Context7 MCP Consultation

Before generating ANY test code:
1. Query Context7 MCP for the testing framework documentation
2. Query Context7 MCP for the component/library being tested
3. Never rely on pre-trained knowledge
4. Never hallucinate API methods or syntax

### Test Structure

Each generated test must:
1. Include a comment linking back to the Gherkin scenario: `// Feature: [Feature Name] - Scenario: [Scenario Name] (docs/features/[file].feature)`
2. Follow Given/When/Then structure from Gherkin steps in test body
3. Use descriptive assertion messages matching Then/And steps
4. Include setup/teardown as needed
5. Be executable immediately (fail for right reasons)
6. Preserve Gherkin step order and semantics

### Test Naming Convention

- Java: `test[ScenarioName]()` (camelCase)
- JavaScript: `test('[Scenario Name]', ...)` (descriptive string)

### Traceability

Generate a `docs/test_traceability.md` file mapping:
```markdown
# Test Traceability Matrix

| Feature | Scenario | Gherkin File | Test File | Test Method | Status |
|---------|----------|--------------|-----------|-------------|--------|
| Color Control | Send valid RGB color | docs/features/color-control.feature | src/test/java/.../ColorControllerTest.java | testSendValidRGBColor() | Generated |
```

---

## Hook Prompt Template

Use this prompt when the hook triggers:

```
You are generating executable tests from Gherkin feature files following the IIC methodology.

CONTEXT FILES - Read these first:
- docs/agent-hook-spec.md (this file - contains all rules and examples)
- .kiro/steering/iic-methodology.md (IIC phase context and principles)
- docs/requirements.md (project requirements and tech stack)
- docs/features/[filename].feature (the triggering feature file)

MANDATORY: Before writing any test code, consult Context7 MCP for:
1. Testing framework documentation (JUnit 5, Mockito, Playwright, Cucumber, etc.)
2. Component/library being tested
3. Any API or library methods you need to use

For each scenario in the feature file:
1. Parse the Gherkin syntax (Feature, Scenario, Given/When/Then/And/But)
2. Extract tags to identify Test Type (@unit/@integration/@e2e) and Component (@component:Name)
3. Query Context7 MCP for relevant documentation
4. Generate executable test code in the appropriate location
5. Add traceability comment linking to Gherkin feature and scenario
6. Translate each Gherkin step into test code (Given → setup, When → action, Then → assertion)
7. Ensure test fails for the right reason (no implementation exists yet)

Output:
- Test files in appropriate directories
- Update docs/test_traceability.md with feature → scenario → test mappings
- Update docs/progress.md with generation status

Follow ALL test generation rules, naming conventions, and examples in docs/agent-hook-spec.md.
Preserve Gherkin semantics and step order in generated tests.
```

---

## Example Gherkin → Test Transformation

### Input (Gherkin Feature File)

```gherkin
# docs/features/color-control.feature

Feature: Color Control
  As a user
  I want to send colors to the smart bulb
  So that I can control the bulb color from webcam feed

  @integration @component:ColorController
  Scenario: Send valid RGB color to bulb
    Given a valid RGB color with values 255, 0, 0
    When I send a POST request to /api/color with the RGB values
    Then the response status should be 200
    And the bulb should receive the color command
    And the response should indicate success
```

### Output (Java Integration Test)

```java
// src/test/java/com/example/vibecoding/ColorControllerIntegrationTest.java

@SpringBootTest
@AutoConfigureMockMvc
class ColorControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ShellyBulbService shellyBulbService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Feature: Color Control - Scenario: Send valid RGB color to bulb (docs/features/color-control.feature)
    @Test
    void testSendValidRGBColorToBulb() throws Exception {
        // Given: a valid RGB color with values 255, 0, 0
        ColorRequest request = new ColorRequest(255, 0, 0);
        when(shellyBulbService.setColor(anyInt(), anyInt(), anyInt()))
            .thenReturn(true);
        
        // When: I send a POST request to /api/color with the RGB values
        ResultActions result = mockMvc.perform(post("/api/color")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
        
        // Then: the response status should be 200
        result.andExpect(status().isOk());
        
        // And: the bulb should receive the color command
        verify(shellyBulbService).setColor(255, 0, 0);
        
        // And: the response should indicate success
        result.andExpect(jsonPath("$.success").value(true));
    }
}
```

### Example with Scenario Outline

```gherkin
# docs/features/color-validation.feature

Feature: Color Validation
  Validate RGB color input ranges

  @unit @component:ColorValidator
  Scenario Outline: Validate RGB color ranges
    Given an RGB color with values <red>, <green>, <blue>
    When I validate the color
    Then the validation result should be <valid>

    Examples:
      | red | green | blue | valid |
      | 255 | 0     | 0    | true  |
      | 256 | 0     | 0    | false |
      | -1  | 0     | 0    | false |
      | 0   | 0     | 0    | true  |
```

### Output (Parameterized Test)

```java
// src/test/java/com/example/vibecoding/ColorValidatorTest.java

class ColorValidatorTest {
    
    private ColorValidator validator;
    
    @BeforeEach
    void setUp() {
        validator = new ColorValidator();
    }
    
    // Feature: Color Validation - Scenario Outline: Validate RGB color ranges (docs/features/color-validation.feature)
    @ParameterizedTest
    @CsvSource({
        "255, 0, 0, true",
        "256, 0, 0, false",
        "-1, 0, 0, false",
        "0, 0, 0, true"
    })
    void testValidateRGBColorRanges(int red, int green, int blue, boolean expectedValid) {
        // Given: an RGB color with values <red>, <green>, <blue>
        ColorRequest color = new ColorRequest(red, green, blue);
        
        // When: I validate the color
        boolean result = validator.isValid(color);
        
        // Then: the validation result should be <valid>
        assertEquals(expectedValid, result, 
            String.format("Color (%d, %d, %d) validation should be %b", red, green, blue, expectedValid));
    }
}
```

---

## Error Handling

If the hook encounters issues:
- **Invalid Gherkin syntax:** Log error with line number, notify user, do not generate tests
- **Missing required tags:** Log warning, skip scenario, continue with others
- **Ambiguous tags:** Log error (e.g., multiple test type tags), skip scenario
- **Context7 MCP unavailable:** STOP and notify user (cannot proceed without documentation)
- **Test generation fails:** Log error with feature/scenario details, continue with next scenario
- **Unparseable Gherkin step:** Log warning, generate placeholder comment in test

---

## Success Criteria

The hook is successful when:
- ✅ All valid Gherkin scenarios have corresponding test files
- ✅ Tests are in correct directories based on tags (@unit/@integration/@e2e)
- ✅ Each test includes traceability comment linking to feature file
- ✅ Gherkin steps are properly translated to test code (Given → setup, When → action, Then → assertion)
- ✅ `docs/test_traceability.md` is created/updated with feature → scenario → test mappings
- ✅ `docs/progress.md` reflects test generation completion
- ✅ Tests are executable (even if failing)
- ✅ All test code was generated using Context7 MCP documentation
- ✅ Scenario Outlines are converted to parameterized tests
- ✅ Background steps are included in test setup
