#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const SCOPE = {
  PROJECT: "project",
  GLOBAL: "global",
};

const EDITORS = {
  antigravity: { name: "Antigravity", paths: [".agent/skills/jsdoc-over-inline-comments.md"], format: "md" },
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

const RULES = {
  "jsdoc-over-inline-comments": {
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
  },
  "manual-cleanup-comments": {
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
  },
};

const RULE_CHOICES = {
  JSDOC: "jsdoc-over-inline-comments",
  MANUAL: "manual-cleanup-comments",
  ALL: "all",
};

function getVisibleItems() {
  const termHeight = process.stdout.rows || 24;
  const reservedRows = 8;
  return Math.max(5, Math.min(20, termHeight - reservedRows));
}

function getFormattedContent(ruleKey, format) {
  const rule = RULES[ruleKey];
  if (!rule) return "";
  return format === "mdc" ? rule.mdcFrontmatter + rule.content : rule.content;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getTargetDir(scope) {
  return scope === SCOPE.GLOBAL ? os.homedir() : process.cwd();
}

function getScopeLabel(scope) {
  return scope === SCOPE.GLOBAL ? "global (~)" : "project (.)";
}

function getFilePath(editorKey, ruleKey) {
  const editor = EDITORS[editorKey];
  if (!editor) return null;
  
  const basePath = editor.paths[0];
  const ext = editor.format === "mdc" ? ".mdc" : ".md";
  
  if (basePath.includes("jsdoc-over-inline-comments")) {
    return basePath.replace("jsdoc-over-inline-comments", RULES[ruleKey].filename);
  }
  
  const dir = path.dirname(basePath);
  const filename = RULES[ruleKey].filename + ext;
  
  if (dir === ".") {
    if (["CONVENTIONS.md", "AGENTS.md", "CLAUDE.md", "GEMINI.md"].includes(basePath)) {
      return basePath;
    }
    if (basePath.startsWith(".") && !basePath.includes("/")) {
      return basePath;
    }
  }
  
  return path.join(dir, filename);
}

function installForEditor(editorKey, scope = SCOPE.PROJECT, selectedRules = [RULE_CHOICES.JSDOC]) {
  const editor = EDITORS[editorKey];
  if (!editor) return [];

  const targetDir = getTargetDir(scope);
  const installedFiles = [];
  
  const rulesToInstall = selectedRules.includes(RULE_CHOICES.ALL) 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : selectedRules;

  for (const ruleKey of rulesToInstall) {
    const content = getFormattedContent(ruleKey, editor.format);
    const relativePath = getFilePath(editorKey, ruleKey);
    
    if (relativePath && content) {
      const fullPath = path.join(targetDir, relativePath);
      ensureDir(path.dirname(fullPath));
      fs.writeFileSync(fullPath, content, "utf8");
      installedFiles.push(relativePath);
    }
  }

  return installedFiles;
}

const term = {
  write: (s) => process.stdout.write(s),
  hideCursor: () => term.write("\x1b[?25l"),
  showCursor: () => term.write("\x1b[?25h"),
  clear: () => term.write("\x1b[2J\x1b[H"),
  goto: (r, c) => term.write(`\x1b[${r};${c}H`),
  clearLine: () => term.write("\x1b[2K"),
  line: (r, text) => {
    term.goto(r, 1);
    term.clearLine();
    term.write(text);
  },
};

class Menu {
  constructor(title, options, multiSelect = false) {
    this.title = title;
    this.options = options;
    this.multiSelect = multiSelect;
    this.cursor = 0;
    this.scroll = 0;
    this.selected = new Set();
    this.total = options.length;
    this.headerRows = 5;
    this.lastScroll = -1;
    this.message = "";
  }

  get visible() {
    return Math.min(getVisibleItems(), this.total);
  }

  getItemRow(index) {
    return this.headerRows + 1 + (index - this.scroll);
  }

  updateScroll() {
    let needsFullRedraw = false;
    const maxScroll = Math.max(0, this.total - this.visible);
    
    if (this.cursor < this.scroll) {
      this.scroll = this.cursor;
      needsFullRedraw = true;
    } else if (this.cursor >= this.scroll + this.visible) {
      this.scroll = Math.min(this.cursor - this.visible + 1, maxScroll);
      needsFullRedraw = true;
    }
    
    this.scroll = Math.max(0, Math.min(this.scroll, maxScroll));
    
    return needsFullRedraw;
  }

  drawHeader() {
    term.line(1, "");
    term.line(2, this.title);
    term.line(3, "");
    if (this.multiSelect) {
      term.line(4, "  Arrows/PgUp/PgDn: Move | Space: Select | A: All | N: None | Enter: OK");
    } else {
      term.line(4, "  Arrows/PgUp/PgDn: Move | Enter: Select");
    }
  }

  drawScrollUp() {
    const row = this.headerRows;
    if (this.scroll > 0) {
      term.line(row, `      ^ ${this.scroll} more above`);
    } else {
      term.line(row, "");
    }
  }

  drawScrollDown() {
    const row = this.headerRows + this.visible + 1;
    const lastVisible = Math.min(this.scroll + this.visible, this.total);
    const below = this.total - lastVisible;
    if (below > 0) {
      term.line(row, `      v ${below} more below`);
    } else {
      term.line(row, "");
    }
  }

  drawItem(index) {
    if (index < this.scroll || index >= this.scroll + this.visible) return;
    
    const row = this.getItemRow(index);
    const opt = this.options[index];
    const isCursor = index === this.cursor;
    const prefix = isCursor ? " > " : "   ";
    
    let marker;
    if (this.multiSelect) {
      marker = this.selected.has(opt.key) ? "[x]" : "[ ]";
    } else {
      marker = isCursor ? "(*)" : "( )";
    }
    
    term.line(row, `${prefix}${marker} ${opt.label}`);
  }

  drawAllItems() {
    for (let i = this.scroll; i < this.scroll + this.visible && i < this.total; i++) {
      this.drawItem(i);
    }
  }

  drawStatus() {
    const statusRow = this.headerRows + this.visible + 2;
    const msgRow = this.headerRows + this.visible + 3;
    
    if (this.multiSelect) {
      term.line(statusRow, `  [${this.cursor + 1}/${this.total}]  Selected: ${this.selected.size}`);
    } else {
      term.line(statusRow, `  [${this.cursor + 1}/${this.total}]`);
    }
    
    if (this.message) {
      term.line(msgRow, `  [!] ${this.message}`);
    } else {
      term.line(msgRow, "");
    }
  }

  clearMessage() {
    this.message = "";
    const msgRow = this.headerRows + this.visible + 3;
    term.line(msgRow, "");
  }

  showMessage(msg) {
    this.message = msg;
    const msgRow = this.headerRows + this.visible + 3;
    term.line(msgRow, `  [!] ${msg}`);
  }

  fullDraw() {
    term.clear();
    term.hideCursor();
    this.updateScroll();
    this.drawHeader();
    this.drawScrollUp();
    this.drawAllItems();
    this.drawScrollDown();
    this.drawStatus();
    this.lastScroll = this.scroll;
  }

  partialDraw(prevCursor) {
    this.clearMessage();
    const scrollChanged = this.updateScroll();
    
    if (scrollChanged || this.lastScroll !== this.scroll) {
      this.drawScrollUp();
      this.drawAllItems();
      this.drawScrollDown();
      this.lastScroll = this.scroll;
    } else {
      this.drawItem(prevCursor);
      this.drawItem(this.cursor);
    }
    
    this.drawStatus();
  }

  run() {
    return new Promise((resolve) => {
      this.fullDraw();

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      const onResize = () => {
        this.fullDraw();
      };
      process.stdout.on("resize", onResize);

      const cleanup = () => {
        process.stdout.removeListener("resize", onResize);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener("data", onKey);
        process.stdin.pause();
        term.showCursor();
        term.clear();
      };

      const onKey = (key) => {
        const prevCursor = this.cursor;

        if (key === "\x1b[A") {
          if (this.cursor > 0) {
            this.cursor--;
            this.partialDraw(prevCursor);
          }
        } else if (key === "\x1b[B") {
          if (this.cursor < this.total - 1) {
            this.cursor++;
            this.partialDraw(prevCursor);
          }
        } else if (key === "\x1b[5~") {
          this.cursor = Math.max(0, this.cursor - this.visible);
          this.partialDraw(prevCursor);
        } else if (key === "\x1b[6~") {
          this.cursor = Math.min(this.total - 1, this.cursor + this.visible);
          this.partialDraw(prevCursor);
        } else if (key === "\x1b[H" || key === "\x1b[1~") {
          this.cursor = 0;
          this.partialDraw(prevCursor);
        } else if (key === "\x1b[F" || key === "\x1b[4~") {
          this.cursor = this.total - 1;
          this.partialDraw(prevCursor);
        } else if (key === " " && this.multiSelect) {
          this.clearMessage();
          const k = this.options[this.cursor].key;
          if (this.selected.has(k)) {
            this.selected.delete(k);
          } else {
            this.selected.add(k);
          }
          this.drawItem(this.cursor);
          this.drawStatus();
        } else if ((key === "a" || key === "A") && this.multiSelect) {
          this.clearMessage();
          this.options.forEach((o) => this.selected.add(o.key));
          this.drawAllItems();
          this.drawStatus();
        } else if ((key === "n" || key === "N") && this.multiSelect) {
          this.clearMessage();
          this.selected.clear();
          this.drawAllItems();
          this.drawStatus();
        } else if (key === "\r" || key === "\n") {
          if (this.multiSelect && this.selected.size === 0) {
            this.showMessage("Please select at least 1 editor (use Space to select)");
            return;
          }
          cleanup();
          if (this.multiSelect) {
            resolve(Array.from(this.selected));
          } else {
            resolve(this.options[this.cursor].key);
          }
        } else if (key === "\x03") {
          cleanup();
          process.exit(0);
        }
      };

      process.stdin.on("data", onKey);
    });
  }
}

function listEditors() {
  console.log("\n[i] Supported editors/agents:\n");
  Object.entries(EDITORS).forEach(([key, editor]) => {
    console.log(`    ${key.padEnd(14)} - ${editor.name}`);
  });
  console.log(`    ${"all".padEnd(14)} - Install for all editors`);
  console.log(`\n    Total: ${Object.keys(EDITORS).length} editors\n`);
}

function showHelp() {
  console.log(`
comment-rules - Install comment policy rules for AI code editors

Usage:
  npx comment-rules                       Interactive mode
  npx comment-rules [editors...]          Install for specific editor(s)
  npx comment-rules [editors...] -g       Install globally
  npx comment-rules --all                 Install for all editors
  npx comment-rules --list                List all supported editors

Options:
  -g, --global         Install to home directory
  -a, --all            Install for all supported editors
  -l, --list           List all supported editors
  -h, --help           Show this help
  --rule <name>        Select rule (default: jsdoc)

Rules:
  jsdoc                jsdoc-over-inline-comments (always apply)
  manual               manual-cleanup-comments (on-demand)
  all                  Both rules

Examples:
  npx comment-rules cursor
  npx comment-rules cursor --rule manual
  npx comment-rules cursor --rule all
  npx comment-rules --all --rule all
`);
}

async function interactiveMode() {
  const scopeMenu = new Menu(
    "=== Comment Rules Installer ===",
    [
      { key: SCOPE.PROJECT, label: "Project - Install to current directory (.)" },
      { key: SCOPE.GLOBAL, label: "Global  - Install to home directory (~)" },
    ],
    false
  );
  const scope = await scopeMenu.run();

  const ruleMenu = new Menu(
    `=== Select Rules [${getScopeLabel(scope)}] ===`,
    [
      { key: RULE_CHOICES.ALL, label: "All rules (both above)" },
      { key: RULE_CHOICES.JSDOC, label: "jsdoc-over-inline-comments (always apply - prefer JSDoc)" },
      { key: RULE_CHOICES.MANUAL, label: "manual-cleanup-comments (on-demand skill - clean up comments)" },
    ],
    false
  );
  const selectedRule = await ruleMenu.run();

  const editorOptions = Object.entries(EDITORS).map(([key, editor]) => ({
    key,
    label: editor.name,
  }));

  const editorMenu = new Menu(
    `=== Select Editors [${getScopeLabel(scope)}] ===`,
    editorOptions,
    true
  );
  const selectedEditors = await editorMenu.run();

  const rulesToInstall = selectedRule === RULE_CHOICES.ALL 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : [selectedRule];

  const ruleNames = rulesToInstall.map(r => RULES[r].filename).join(", ");
  console.log(`\n[+] Installing ${ruleNames} for ${selectedEditors.length} editor(s)...\n`);

  for (const editorKey of selectedEditors) {
    const files = installForEditor(editorKey, scope, rulesToInstall);
    console.log(`    [ok] ${EDITORS[editorKey].name}`);
  }

  console.log(`\n[*] Install complete!\n`);
}

function installAll(scope = SCOPE.PROJECT, selectedRules = [RULE_CHOICES.JSDOC]) {
  const rulesToInstall = selectedRules.includes(RULE_CHOICES.ALL) 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : selectedRules;
  
  const ruleNames = rulesToInstall.map(r => RULES[r].filename).join(", ");
  console.log(`\n[+] Installing ${ruleNames} for all editors (${getScopeLabel(scope)})...\n`);

  Object.keys(EDITORS).forEach((editorKey) => {
    installForEditor(editorKey, scope, rulesToInstall);
    console.log(`    [ok] ${EDITORS[editorKey].name}`);
  });

  console.log("\n[*] Install complete!\n");
}

function parseArgs(args) {
  const result = { 
    editors: [], 
    scope: SCOPE.PROJECT, 
    action: null,
    rules: [RULE_CHOICES.JSDOC]
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const lower = arg.toLowerCase();

    if (lower === "--global" || lower === "-g") {
      result.scope = SCOPE.GLOBAL;
    } else if (lower === "--help" || lower === "-h") {
      result.action = "help";
    } else if (lower === "--list" || lower === "-l") {
      result.action = "list";
    } else if (lower === "--all" || lower === "-a") {
      result.action = "all";
    } else if (lower === "--rule" || lower === "-r") {
      const nextArg = args[i + 1]?.toLowerCase();
      if (nextArg === "jsdoc" || nextArg === "jsdoc-over-inline-comments") {
        result.rules = [RULE_CHOICES.JSDOC];
        i++;
      } else if (nextArg === "manual" || nextArg === "manual-cleanup-comments") {
        result.rules = [RULE_CHOICES.MANUAL];
        i++;
      } else if (nextArg === "all") {
        result.rules = [RULE_CHOICES.ALL];
        i++;
      }
    } else if (EDITORS[lower]) {
      result.editors.push(lower);
    } else if (!lower.startsWith("-")) {
      result.editors.push(lower);
    }
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await interactiveMode();
    return;
  }

  const { editors, scope, action, rules } = parseArgs(args);

  if (action === "help") {
    showHelp();
    return;
  }

  if (action === "list") {
    listEditors();
    return;
  }

  if (action === "all") {
    installAll(scope, rules);
    return;
  }

  const validEditors = editors.filter((e) => EDITORS[e]);
  const invalidEditors = editors.filter((e) => !EDITORS[e]);

  if (invalidEditors.length > 0) {
    console.log(`\n[!] Unknown editor(s): ${invalidEditors.join(", ")}`);
  }

  if (validEditors.length === 0) {
    if (invalidEditors.length > 0) {
      listEditors();
      process.exit(1);
    }
    showHelp();
    return;
  }

  const rulesToInstall = rules.includes(RULE_CHOICES.ALL) 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : rules;
  const ruleNames = rulesToInstall.map(r => RULES[r].filename).join(", ");
  
  console.log(`\n[+] Installing ${ruleNames} for ${validEditors.length} editor(s)...\n`);

  for (const editorKey of validEditors) {
    installForEditor(editorKey, scope, rulesToInstall);
    console.log(`    [ok] ${EDITORS[editorKey].name}`);
  }

  console.log(`\n[*] Install complete!\n`);
}

main().catch(console.error);
