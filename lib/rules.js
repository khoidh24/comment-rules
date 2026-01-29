const SCOPE = {
  PROJECT: "project",
  GLOBAL: "global",
};

const EDITORS = {
  antigravity: { name: "Antigravity", paths: [".antigravity/rules/jsdoc-over-inline-comments.md"], format: "md" },
  aider: { name: "Aider", paths: ["CONVENTIONS.md"], format: "md" },
  claude: { name: "Claude Code", paths: ["CLAUDE.md"], format: "md" },
  cline: { name: "Cline", paths: [".clinerules"], format: "md" },
  codebuddy: { name: "CodeBuddy", paths: [".codebuddy/rules/jsdoc-over-inline-comments.md"], format: "md" },
  codex: { name: "Codex", paths: ["AGENTS.md"], format: "md" },
  commandcode: { name: "Command Code", paths: [".commandcode/rules/jsdoc-over-inline-comments.md"], format: "md" },
  continue: { name: "Continue", paths: [".continue/rules/jsdoc-over-inline-comments.md"], format: "md" },
  crush: { name: "Crush", paths: [".crush/rules/jsdoc-over-inline-comments.md"], format: "md" },
  cursor: { name: "Cursor", paths: [".cursor/rules/jsdoc-over-inline-comments.mdc"], format: "mdc" },
  droid: { name: "Droid", paths: [".droid/rules/jsdoc-over-inline-comments.md"], format: "md" },
  gemini: { name: "Gemini CLI", paths: ["GEMINI.md"], format: "md" },
  copilot: { name: "GitHub Copilot", paths: [".github/copilot-instructions.md"], format: "md" },
  goose: { name: "Goose", paths: [".goose/rules/jsdoc-over-inline-comments.md"], format: "md" },
  junie: { name: "Junie", paths: [".junie/rules/jsdoc-over-inline-comments.md"], format: "md" },
  kilocode: { name: "Kilo Code", paths: [".kilocode/rules/jsdoc-over-inline-comments.md"], format: "md" },
  kiro: { name: "Kiro CLI", paths: [".kiro/rules/jsdoc-over-inline-comments.md"], format: "md" },
  kode: { name: "Kode", paths: [".kode/rules/jsdoc-over-inline-comments.md"], format: "md" },
  mcpjam: { name: "MCPJam", paths: [".mcpjam/rules/jsdoc-over-inline-comments.md"], format: "md" },
  moltbot: { name: "Moltbot", paths: [".moltbot/rules/jsdoc-over-inline-comments.md"], format: "md" },
  mux: { name: "Mux", paths: [".mux/rules/jsdoc-over-inline-comments.md"], format: "md" },
  neovate: { name: "Neovate", paths: [".neovate/rules/jsdoc-over-inline-comments.md"], format: "md" },
  opencode: { name: "OpenCode", paths: [".opencode/rules/jsdoc-over-inline-comments.md"], format: "md" },
  openhands: { name: "OpenHands", paths: [".openhands/rules/jsdoc-over-inline-comments.md"], format: "md" },
  pi: { name: "Pi", paths: [".pi/rules/jsdoc-over-inline-comments.md"], format: "md" },
  pochi: { name: "Pochi", paths: [".pochi/rules/jsdoc-over-inline-comments.md"], format: "md" },
  qoder: { name: "Qoder", paths: [".qoder/rules/jsdoc-over-inline-comments.md"], format: "md" },
  qwencode: { name: "Qwen Code", paths: [".qwencode/rules/jsdoc-over-inline-comments.md"], format: "md" },
  roocode: { name: "Roo Code", paths: [".roo/rules/jsdoc-over-inline-comments.md"], format: "md" },
  trae: { name: "Trae", paths: [".trae/rules/jsdoc-over-inline-comments.md"], format: "md" },
  windsurf: { name: "Windsurf", paths: [".windsurfrules"], format: "md" },
  zed: { name: "Zed", paths: [".zed/rules/jsdoc-over-inline-comments.md"], format: "md" },
  zencoder: { name: "Zencoder", paths: [".zencoder/rules/jsdoc-over-inline-comments.md"], format: "md" },
};

const SINGLE_FILE_EDITORS = [
  "CONVENTIONS.md",
  "AGENTS.md", 
  "CLAUDE.md",
  "GEMINI.md",
  ".clinerules",
  ".windsurfrules",
  ".github/copilot-instructions.md"
];

const JSDOC_RULE = {
  name: "JSDoc Over Inline Comments (always apply)",
  filename: "jsdoc-over-inline-comments",
  mdcFrontmatter: `---
description: No inline comments. Use JSDoc. Only comment for truly complex logic.
globs:
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

`,
  content: `# Comment Policy (STRICT)

## Absolute Rules

- DO NOT add inline or line-by-line comments (e.g. \`// do X\`, \`// set y\`).
- Prefer clear naming + small functions over comments.
- When adding a new feature/function/class/module, write JSDoc for:
  - exported functions/classes
  - public methods
  - non-trivial internal helpers

## No Emoji in JSDoc/Comments

- DO NOT use emojis anywhere in:
  - JSDoc blocks (\`/** ... */\`)
  - block comments (\`/* ... */\`)
  - line comments (\`// ...\`)
- Keep tone professional and ASCII/plain text.

## JSDoc Requirements

- Must include: purpose (1 sentence), @param, @returns (or void), and important constraints.
- Include examples only when behavior is subtle.

## When Comments Are Allowed (Rare)

Only add a single block comment ABOVE a logic block if ALL are true:

- The logic is algorithmically or conceptually complex AND
- The intent / invariants / pitfalls cannot be made obvious by refactor + naming.

Allowed comment format (focus on WHY, no emoji):
\`\`\`
/**
 * WHY: ...
 * Invariants: ...
 * Pitfalls/Edge cases: ...
 * References (optional): link to spec/ticket/doc
 */
\`\`\`

## What to Do Instead of Comments

- Refactor into small pure functions
- Use descriptive names
- Add tests that demonstrate edge cases

## Examples

### Good (JSDoc, no emoji)

\`\`\`ts
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
\`\`\`

### Bad (emoji in comments/JSDoc)

\`\`\`ts
/** Do this quickly */
export function f() {}

/* TODO improve performance */
\`\`\`

### Bad (line-by-line comments)

\`\`\`ts
// get user
const user = await getUser(id);
// update user
user.name = name;
// save user
await saveUser(user);
\`\`\`
`,
};

const MANUAL_RULE = {
  name: "Manual Cleanup Comments (on-demand skill)",
  filename: "manual-cleanup-comments",
  mdcFrontmatter: `---
description: "(MANUAL) Clean comments: remove inline comments, replace with JSDoc, keep only complex-logic comments, no emoji."
globs:
  - "**/*.{js,jsx,ts,tsx}"
alwaysApply: false
---

`,
  content: `# MANUAL SKILL: Clean up comments (remove inline, add JSDoc)

## When to use

Only run this skill when explicitly requested (manual invocation). Do not apply automatically.

## Goal

Refactor code to:

- Remove low-signal / line-by-line comments.
- Replace descriptive comments with proper JSDoc on function/class/module boundaries.
- Keep comments ONLY when logic is truly complex (WHY / invariants / pitfalls), as a single block comment above the relevant block.
- No emoji anywhere in comments/JSDoc.

## Hard rules

1. DO NOT leave line-by-line comments explaining obvious steps.
2. DO NOT add emoji in any comment/JSDoc.
3. Prefer refactor (naming, small functions) over comments.
4. Keep "directive comments" that affect tooling/behavior:
   - eslint / tslint directives (e.g. \`// eslint-disable...\`, \`/* eslint ... */\`)
   - TypeScript directives (\`// @ts-ignore\`, \`// @ts-expect-error\`, \`// @ts-nocheck\`)
   - formatter directives (\`// prettier-ignore\`)
   - build/runtime directives used by frameworks (keep as-is if required)
5. Keep required legal headers / license banners at file top if present.

## What counts as "complex logic comment" (allowed)

Only keep a single block comment placed ABOVE the complex logic block if it contains:

- WHY: design reason / trade-off not obvious from code
- Invariants / assumptions
- Pitfalls / edge cases / concurrency / precision / timezone / security concerns
- Brief reference to spec/ticket/doc (optional)

Allowed format (NO emoji):
\`\`\`
/**
 * WHY: ...
 * Invariants: ...
 * Pitfalls/Edge cases: ...
 * References (optional): ...
 */
\`\`\`

## What to delete (default)

- Step-by-step comments like \`// get user\`, \`// call api\`, \`// update state\`
- Redundant comments that restate variable/function names
- Commented-out code (remove, unless it's a required conditional compilation marker; if unsure, remove and rely on git history)

## Convert comments to JSDoc (preferred)

When a comment describes behavior of a function/class/module, convert into JSDoc and attach it to that symbol.

### JSDoc requirements

For any exported function/class, public method, or non-trivial helper you touch:

- 1 sentence purpose
- @param for each param
- @returns (or void)
- Include constraints/edge cases if important
- NO emoji

Example:
\`\`\`
/**
 * Parses a user-provided date string using a fixed timezone.
 * @param input - Date string from UI.
 * @param tz - IANA timezone used for interpretation.
 * @returns A Date instance, or null if invalid.
 */
\`\`\`

## Procedure (do this every time skill is invoked)

1. Read the target file(s) fully (or at least all impacted sections).
2. Remove line-by-line comments and redundant comments.
3. Refactor to make intent obvious:
   - rename variables
   - extract small functions
   - reduce nesting
4. Add/upgrade JSDoc on boundaries (functions/classes/modules).
5. Only keep a complex-logic block comment if refactor + JSDoc cannot express the WHY/invariants/pitfalls.
6. Final scan:
   - ensure no emoji in any comments/JSDoc
   - ensure no stray inline comments remain (except directives)
   - ensure TypeScript/ESLint directive comments (if any) still correct

## Output expectation (when run by an agent)

- Provide the updated code (or diff) with comment cleanup applied.
- If a comment is kept, justify implicitly by its content (WHY/invariants/pitfalls), not by meta explanation.
`,
};

const RULES = {
  "jsdoc-over-inline-comments": JSDOC_RULE,
  "manual-cleanup-comments": MANUAL_RULE,
};

const RULE_CHOICES = {
  JSDOC: "jsdoc-over-inline-comments",
  MANUAL: "manual-cleanup-comments",
  ALL: "all",
};

module.exports = {
  SCOPE,
  EDITORS,
  RULES,
  RULE_CHOICES,
  SINGLE_FILE_EDITORS,
};
