# Robocoders Devoxx Belgium - AI Coding Methodologies

A demonstration repository showcasing different AI-assisted development methodologies for building software with AI coding agents. This project was created for a live 3-hour conference demo at Devoxx Belgium, demonstrating how different agentic AI IDEs and tools (Windsurf, Junie, Kiro, Claude Code, OpenAI Codex) can work with structured methodologies.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Sample Project: RGBW Control App](#sample-project-rgbw-control-app)
- [Methodologies](#methodologies)
  - [Prompt-Driven Development (PDD)](#prompt-driven-development-pdd)
  - [Intent Integrity Chain (IIC)](#intent-integrity-chain-iic)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## 🎯 Project Overview

This repository demonstrates **structured approaches to AI-assisted software development**. Rather than ad-hoc prompting, it showcases disciplined methodologies that provide:

- **Traceability**: Every code change traces back to requirements
- **Quality gates**: Human review at critical decision points
- **Artifact management**: Explicit documentation and version control
- **Predictable outcomes**: Structured workflows reduce AI hallucination risks

The repository contains:
1. Two complete methodology specifications (PDD and IIC)
2. Sample project requirements (RGBW smart bulb control app)
3. Starter prompts and guidelines for AI agents
4. Tool-specific configurations (Kiro hooks)

## 💡 Sample Project: RGBW Control App

The sample project is a **Vibecoding Demo** - a web application that:

- Uses webcam feed to detect dominant colors in real-time
- Controls a Shelly Duo GU10 RGBW smart bulb over the local network
- Provides both manual and automatic color control modes
- Runs entirely locally (no cloud, databases, or Docker)

**Technology Stack:**
- **Backend**: Java 25 + Spring Boot 3.5.6 + Maven
- **Frontend**: Vanilla HTML5 + Modern JavaScript (ES2024) + Color Thief 2.4.0
- **Design Philosophy**: Intentional simplicity for live demo purposes

See [`docs/requirements.md`](docs/requirements.md) for complete specifications.

## 📚 Methodologies

### Prompt-Driven Development (PDD)

**Philosophy**: Structured requirements-to-tasks workflow with explicit artifact gates and mandatory traceability.

**Process Flow**:
```
Prompt → Requirements → Implementation Plan → Tasks → Guidelines
```

**Key Features**:
- Sequential numbering of all requirements
- Dual traceability links (plan → requirements, tasks → plan + requirements)
- Development phases: Setup → Core → Advanced → Testing → QA → Deployment
- Primary artifact: `docs/tasks.md` (the authoritative task list)

**When to Use**:
- Projects with clear requirements upfront
- Teams that value comprehensive planning
- Scenarios requiring full audit trails
- Incremental delivery with defined milestones

**Documentation**: See [`docs/prompt-driven-development.md`](docs/prompt-driven-development.md)

### Intent Integrity Chain (IIC)

**Philosophy**: Test-first software delivery with gated phases and mandatory stop after test generation for human review.

**Process Flow**:
```
Init → Analysis → Specification → Test Construction (STOP) → Implementation → Hardening
```

**Key Features**:
- **Hard stop after test generation** - humans approve tests before code
- Locked tests cannot be modified during implementation
- Phase-based tagging protocol
- Behavioral specifications (Gherkin or equivalent)
- NFR validation in hardening phase

**When to Use**:
- Test-driven development workflows
- Quality-critical applications
- Teams that want to validate test coverage before implementation
- Scenarios requiring explicit phase gates

**Documentation**: See [`docs/intent-integrity-chain.md`](docs/intent-integrity-chain.md)

## 📁 Repository Structure

```
robocoders-devoxx-be/
├── docs/
│   ├── prompt-driven-development.md  # PDD methodology specification
│   ├── intent-integrity-chain.md     # IIC methodology specification
│   └── requirements.md               # Sample project (RGBW Control App) PRD
├── prompts/
│   ├── 01_generate-rules.txt        # Initial setup prompt
│   ├── 02_starter_prompt.txt        # Project kickoff prompt
│   └── kiro/
│       └── hook.txt                  # Kiro-specific automation hooks
├── LICENSE                           # MIT License
└── README.md                         # This file
```

### Key Files

- **`docs/prompt-driven-development.md`**: Complete PDD methodology with artifact structure, traceability rules, and process gates
- **`docs/intent-integrity-chain.md`**: Complete IIC methodology with phase definitions and test-first workflow
- **`docs/requirements.md`**: Sample project requirements demonstrating how to structure specifications for AI agents
- **`prompts/01_generate-rules.txt`**: Instructions for generating methodology-specific steering documents
- **`prompts/02_starter_prompt.txt`**: Template for starting project development with AI agents

## 🚀 Getting Started

### For Humans

1. **Choose a methodology** based on your project needs:
   - Want comprehensive planning upfront? → Use PDD
   - Want test-first with quality gates? → Use IIC

2. **Read the methodology document** thoroughly:
   - PDD: [`docs/prompt-driven-development.md`](docs/prompt-driven-development.md)
   - IIC: [`docs/intent-integrity-chain.md`](docs/intent-integrity-chain.md)

3. **Review the sample project** ([`docs/requirements.md`](docs/requirements.md)) to see how requirements should be structured

4. **Use the starter prompts** in the `prompts/` directory to initiate AI agent workflows

### For AI Agents

If you're an AI agent being directed to this repository:

1. **Read the methodology document** specified by the human (PDD or IIC)
2. **Follow the process exactly** - methodologies have explicit gates and artifact requirements
3. **Use the starter prompts** as templates for understanding the workflow
4. **Consult Context7 MCP** before writing any code (per methodology requirements)
5. **Maintain traceability** - every artifact must link to its predecessor
6. **Stop at gates** - wait for human approval before proceeding to the next phase

## 💻 Usage

### Using Prompt-Driven Development (PDD)

**Step 0**: Generate guidelines
```
Use prompts/01_generate-rules.txt to create .junie/guidelines.md
```

**Step 1**: Structure requirements
```
Transform user prompt into .junie/requirements.md with:
- Sequential numbering
- User stories (As a... I want... so that...)
- Acceptance criteria (WHEN... THEN...)
```

**Step 2**: Create implementation plan
```
Generate docs/plan.md with:
- Plan items linked to requirements
- Priorities and dependencies
- Logical grouping
```

**Step 3**: Decompose into tasks
```
Generate docs/tasks.md with:
- Enumerated tasks with checkboxes
- Dual links (plan item + requirements)
- Development phases
```

### Using Intent Integrity Chain (IIC)

**Phase 0**: Initialize repository
```
Create docs/ structure with empty stubs
Tag: phase-0-init-complete
```

**Phase 1**: Analyze intent
```
Update product_context.md, active_context.md
Define acceptance criteria
Tag: phase-1-analysis-complete
```

**Phase 2**: Write specifications
```
Create behavioral specifications
Define test hierarchy
Tag: phase-2-spec-complete
```

**Phase 3**: Build tests (STOP for human review)
```
Create executable tests
Verify expected failures
Tag: phase-3-tests-locked
WAIT FOR HUMAN APPROVAL
```

**Phase 4**: Implement
```
Write minimal code to pass tests
Refactor with tests passing
Tag: phase-4-implementation-complete
```

**Phase 5**: Harden
```
Validate NFRs (performance, security, linting)
Package release artifacts
Tag: phase-5-hardening-complete
```

## 🎓 Key Concepts

### Traceability
Both methodologies emphasize **bidirectional traceability**:
- Every implementation task links back to a plan item
- Every plan item links back to a requirement
- No orphaned work exists

### Quality Gates
Both methodologies include **mandatory human review points**:
- PDD: After requirements, after tasks
- IIC: After each phase, especially after test construction

### Artifact Management
Both methodologies produce **versioned artifacts**:
- PDD: Uses phase tags (`pdd-phase-1-requirements`)
- IIC: Uses phase tags (`phase-3-tests-locked`)

### AI Agent Guardrails
Both methodologies define **explicit constraints**:
- No implementation without linked requirements
- No test modification during implementation (IIC)
- No phase skipping
- Mandatory stops at defined gates

## 🤝 Contributing

This repository demonstrates methodologies for AI-assisted development. Contributions should maintain the philosophy of structured, traceable, gated workflows.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Baruch Sadogursky

## 🔗 Additional Resources

- **Devoxx Belgium**: Where this methodology was demonstrated
- **Sample Project**: See `docs/requirements.md` for the complete RGBW Control App specification
- **AI Tools Used**: Windsurf, Junie, Kiro, Claude Code, OpenAI Codex

---

**Note**: This repository is a demonstration of methodologies, not a complete implementation. Use it as a template and starting point for your own AI-assisted development projects.
