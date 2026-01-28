#!/usr/bin/env node

const { SCOPE, EDITORS, RULES, RULE_CHOICES } = require("../lib/rules");
const { c, term, Menu, confirm, drawProgressLine } = require("../lib/ui");
const { installForEditor, installAll, getScopeLabel } = require("../lib/installer");

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
    "Where to install?",
    [
      { key: SCOPE.PROJECT, label: "Project - Install to current directory (.)" },
      { key: SCOPE.GLOBAL, label: "Global  - Install to home directory (~)" },
    ],
    false,
    0
  );
  const scope = await scopeMenu.run();

  const ruleMenu = new Menu(
    "Which rules to install?",
    [
      { key: RULE_CHOICES.ALL, label: "All rules (both)" },
      { key: RULE_CHOICES.JSDOC, label: "jsdoc-over-inline-comments (always apply)" },
      { key: RULE_CHOICES.MANUAL, label: "manual-cleanup-comments (on-demand)" },
    ],
    false,
    1
  );
  const selectedRule = await ruleMenu.run();

  const editorOptions = Object.entries(EDITORS).map(([key, editor]) => ({
    key,
    label: editor.name,
  }));

  const editorMenu = new Menu(
    "Select editors/agents:",
    editorOptions,
    true,
    2
  );
  const selectedEditors = await editorMenu.run();

  const rulesToInstall = selectedRule === RULE_CHOICES.ALL 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : [selectedRule];

  const ruleNames = rulesToInstall.map(r => RULES[r].filename).join(", ");
  const editorNames = selectedEditors.map(k => EDITORS[k].name);

  term.clear();
  console.log("");
  console.log(`  ${drawProgressLine(3)}`);
  console.log("");
  console.log(`  ${c.bold}${c.white}Summary${c.reset}`);
  console.log("");
  console.log(`  ${c.dim}Scope:${c.reset}   ${c.bold}${getScopeLabel(scope)}${c.reset}`);
  console.log(`  ${c.dim}Rules:${c.reset}   ${c.bold}${ruleNames}${c.reset}`);
  console.log(`  ${c.dim}Editors:${c.reset} ${c.bold}${editorNames.length} selected${c.reset}`);
  editorNames.forEach(name => console.log(`           ${c.cyan}- ${name}${c.reset}`));
  console.log("");

  const proceed = await confirm(`  ${c.yellow}Proceed? [Y/n]${c.reset} `);
  if (!proceed) {
    console.log(`\n  ${c.yellow}[x] Cancelled.${c.reset}\n`);
    return;
  }

  console.log(`\n  ${c.cyan}Installing...${c.reset}\n`);

  for (const editorKey of selectedEditors) {
    installForEditor(editorKey, scope, rulesToInstall);
    console.log(`  ${c.green}✓${c.reset} ${EDITORS[editorKey].name}`);
  }

  console.log(`\n  ${c.green}${c.bold}Install complete!${c.reset}\n`);
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
  
  console.log(`\n  ${c.cyan}Installing ${ruleNames} for ${validEditors.length} editor(s)...${c.reset}\n`);

  for (const editorKey of validEditors) {
    installForEditor(editorKey, scope, rulesToInstall);
    console.log(`  ${c.green}✓${c.reset} ${EDITORS[editorKey].name}`);
  }

  console.log(`\n  ${c.green}${c.bold}Install complete! (${getScopeLabel(scope)})${c.reset}\n`);
}

main().catch(console.error);
