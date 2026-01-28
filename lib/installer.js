const fs = require("fs");
const path = require("path");
const os = require("os");

const { SCOPE, EDITORS, RULES, RULE_CHOICES, SINGLE_FILE_EDITORS } = require("./rules");

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
  return scope === SCOPE.GLOBAL ? "Global" : "Project";
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

function isSingleFileEditor(editorKey) {
  const editor = EDITORS[editorKey];
  if (!editor) return false;
  return SINGLE_FILE_EDITORS.includes(editor.paths[0]);
}

function installForEditor(editorKey, scope = SCOPE.PROJECT, selectedRules = [RULE_CHOICES.JSDOC]) {
  const editor = EDITORS[editorKey];
  if (!editor) return [];

  const targetDir = getTargetDir(scope);
  const installedFiles = [];
  
  const rulesToInstall = selectedRules.includes(RULE_CHOICES.ALL) 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : selectedRules;

  if (isSingleFileEditor(editorKey) && rulesToInstall.length > 1) {
    const combinedContent = rulesToInstall
      .map(ruleKey => getFormattedContent(ruleKey, editor.format))
      .join("\n---\n\n");
    
    const relativePath = editor.paths[0];
    const fullPath = path.join(targetDir, relativePath);
    ensureDir(path.dirname(fullPath));
    fs.writeFileSync(fullPath, combinedContent, "utf8");
    installedFiles.push(relativePath);
  } else {
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
  }

  return installedFiles;
}

function installAll(scope = SCOPE.PROJECT, selectedRules = [RULE_CHOICES.JSDOC]) {
  const { c } = require("./ui");
  
  const rulesToInstall = selectedRules.includes(RULE_CHOICES.ALL) 
    ? [RULE_CHOICES.JSDOC, RULE_CHOICES.MANUAL]
    : selectedRules;
  
  const ruleNames = rulesToInstall.map(r => RULES[r].filename).join(", ");
  console.log(`\n  ${c.cyan}Installing ${ruleNames} for all editors (${getScopeLabel(scope)})...${c.reset}\n`);

  Object.keys(EDITORS).forEach((editorKey) => {
    installForEditor(editorKey, scope, rulesToInstall);
    console.log(`  ${c.green}✓${c.reset} ${EDITORS[editorKey].name}`);
  });

  console.log(`\n  ${c.green}${c.bold}Install complete!${c.reset}\n`);
}

module.exports = {
  installForEditor,
  installAll,
  getScopeLabel,
  getTargetDir,
};
