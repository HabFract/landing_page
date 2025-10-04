# habfract-landing-page



## Technology Stack

- TypeScript

- React

- Gemini MCP

- Playwright


## Getting Started

This project is scaffolded for optimal AI-assisted development with Claude Code.

### Prerequisites


- Node.js (v18+)



### Launch Claude Code

```bash
./scripts/launch.sh
```

This script will:
- Check for required dependencies
- Start any necessary services
- Open Claude Code with optimal context

### Development Workflow

1. Check current tasks: `/tech tasks` or check Archon
2. Select a task to work on
3. Use `/prime-feature <name>` to load feature context
4. Develop and test
5. Commit with `/lint-and-commit "message"`

6. Archive feature spec with `/spec-compact`


## Project Structure

```
habfract-landing-page/
├── .claude/           # Claude Code configuration
│   ├── commands/      # Custom slash commands
│   ├── agents/        # Sub-agent definitions
│   ├── hooks.json     # Workflow automation hooks
│   └── docs/          # Project documentation
├── .specify/          # SpecKit constitution
├── specs/             # Feature specifications
├── scripts/          # Utility scripts
└── src/               # Source code
```

## Documentation

See `.claude/docs/` for detailed documentation on:
- Architecture patterns
- Development guidelines
- Testing strategies
- Deployment procedures


## Archon Integration

This project integrates with Archon for:
- Task management
- Knowledge base (RAG)
- Code examples
- Project documentation

Access Archon at: http://localhost:8181


## License

MIT
