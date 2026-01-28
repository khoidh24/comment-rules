# comment-rules

> Install comment policy rules for AI code editors and agents.

A CLI tool to quickly add strict comment policy rules to your project for various AI-powered code editors and assistants.

## What This Does

This package provides two rules:

1. **jsdoc-over-inline-comments** (always apply) - Prefer JSDoc over inline comments
2. **manual-cleanup-comments** (on-demand) - Clean up existing comments

## Installation

Run directly with npx (no install required):

```bash
npx comment-rules
```

Or install globally:

```bash
npm install -g comment-rules
```

## Usage

### Interactive Mode (Arrow Key Navigation)

```bash
npx comment-rules
```

Features:

- Use **Up/Down arrows** to navigate
- Press **Space** to toggle selection
- Press **A** to select all, **N** to select none
- Press **Enter** to confirm

### Install for Specific Editor (Project)

```bash
# Cursor (installs to current directory)
npx comment-rules cursor

# GitHub Copilot
npx comment-rules copilot

# Windsurf
npx comment-rules windsurf

# Claude Code
npx comment-rules claude

# And 30+ more editors...
```

### Select Specific Rule

```bash
# Install only manual-cleanup-comments rule
npx comment-rules cursor --rule manual

# Install both rules
npx comment-rules cursor --rule all
```

### Install Globally (Home Directory)

Use `--global` or `-g` flag to install rules to your home directory:

```bash
# Cursor (installs to ~/)
npx comment-rules cursor --global

# All editors globally
npx comment-rules --all -g
```

### Install for All Editors

```bash
# Project scope (current directory)
npx comment-rules --all

# Global scope (home directory)
npx comment-rules --all --global
```

### List Supported Editors

```bash
npx comment-rules --list
```

### Options

| Option          | Description                                            |
| --------------- | ------------------------------------------------------ |
| `-g, --global`  | Install to home directory instead of current directory |
| `-a, --all`     | Install for all supported editors                      |
| `-l, --list`    | List all supported editors                             |
| `-h, --help`    | Show help message                                      |
| `--rule <name>` | Select rule: `jsdoc`, `manual`, or `all`               |

## Supported Editors/Agents (30+)

| Editor         | Config File                                        |
| -------------- | -------------------------------------------------- |
| Aider          | `CONVENTIONS.md`                                   |
| Antigravity    | `.agent/skills/jsdoc-over-inline-comments.md`      |
| Claude Code    | `CLAUDE.md`                                        |
| Cline          | `.clinerules`                                      |
| CodeBuddy      | `.codebuddy/rules/jsdoc-over-inline-comments.md`   |
| Codex          | `AGENTS.md`                                        |
| Command Code   | `.commandcode/rules/jsdoc-over-inline-comments.md` |
| Continue       | `.continue/rules/jsdoc-over-inline-comments.md`    |
| Crush          | `.crush/rules/jsdoc-over-inline-comments.md`       |
| Cursor         | `.cursor/rules/jsdoc-over-inline-comments.mdc`     |
| Droid          | `.droid/rules/jsdoc-over-inline-comments.md`       |
| Gemini CLI     | `GEMINI.md`                                        |
| GitHub Copilot | `.github/copilot-instructions.md`                  |
| Goose          | `.goose/rules/jsdoc-over-inline-comments.md`       |
| Junie          | `.junie/rules/jsdoc-over-inline-comments.md`       |
| Kilo Code      | `.kilocode/rules/jsdoc-over-inline-comments.md`    |
| Kiro CLI       | `.kiro/rules/jsdoc-over-inline-comments.md`        |
| Kode           | `.kode/rules/jsdoc-over-inline-comments.md`        |
| MCPJam         | `.mcpjam/rules/jsdoc-over-inline-comments.md`      |
| Moltbot        | `.moltbot/rules/jsdoc-over-inline-comments.md`     |
| Mux            | `.mux/rules/jsdoc-over-inline-comments.md`         |
| Neovate        | `.neovate/rules/jsdoc-over-inline-comments.md`     |
| OpenCode       | `.opencode/rules/jsdoc-over-inline-comments.md`    |
| OpenHands      | `.openhands/rules/jsdoc-over-inline-comments.md`   |
| Pi             | `.pi/rules/jsdoc-over-inline-comments.md`          |
| Pochi          | `.pochi/rules/jsdoc-over-inline-comments.md`       |
| Qoder          | `.qoder/rules/jsdoc-over-inline-comments.md`       |
| Qwen Code      | `.qwencode/rules/jsdoc-over-inline-comments.md`    |
| Roo Code       | `.roo/rules/jsdoc-over-inline-comments.md`         |
| Trae           | `.trae/rules/jsdoc-over-inline-comments.md`        |
| Windsurf       | `.windsurfrules`                                   |
| Zed            | `.zed/rules/jsdoc-over-inline-comments.md`         |
| Zencoder       | `.zencoder/rules/jsdoc-over-inline-comments.md`    |

## The Rule

### Absolute Rules

- DO NOT add inline or line-by-line comments
- Prefer clear naming + small functions over comments
- Write JSDoc for exported functions/classes and public methods

### JSDoc Requirements

- Purpose (1 sentence)
- `@param` for each parameter
- `@returns` (or void)
- Important constraints

### Good Example

```ts
/**
 * Normalizes a user-provided phone number into E.164-like format.
 * @param input - Raw phone number string from UI.
 * @param defaultCountry - ISO country code used when input has no prefix.
 * @returns Normalized string or null if invalid.
 */
export function normalizePhone(
  input: string,
  defaultCountry: string
): string | null {
  // implementation...
}
```

### Bad Example

```ts
// get user
const user = await getUser(id);
// update user
user.name = name;
// save user
await saveUser(user);
```

## Contributing

Pull requests welcome! If you want to add support for a new editor, edit `bin/cli.js` and add the editor config to the `EDITORS` object.

## License

MIT
