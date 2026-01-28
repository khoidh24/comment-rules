const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
};

const term = {
  write: (s) => process.stdout.write(s),
  hideCursor: () => term.write("\x1b[?25l"),
  showCursor: () => term.write("\x1b[?25h"),
  clear: () => term.write("\x1b[2J\x1b[H"),
  goto: (r, col) => term.write(`\x1b[${r};${col}H`),
  clearLine: () => term.write("\x1b[2K"),
  line: (r, text) => {
    term.goto(r, 1);
    term.clearLine();
    term.write(text);
  },
};

const STEPS = ["Scope", "Rules", "Editors", "Confirm"];

function drawProgressLine(currentStep) {
  const parts = STEPS.map((step, i) => {
    if (i < currentStep) {
      return `${c.green}${c.bold}${step}${c.reset}`;
    } else if (i === currentStep) {
      return `${c.cyan}${c.bold}[${step}]${c.reset}`;
    } else {
      return `${c.dim}${step}${c.reset}`;
    }
  });
  return parts.join(` ${c.dim}>${c.reset} `);
}

function getVisibleItems(total) {
  const termHeight = process.stdout.rows || 24;
  const reservedRows = 10;
  const available = Math.max(5, termHeight - reservedRows);
  return Math.min(available, total);
}

class Menu {
  constructor(title, options, multiSelect = false, step = 0) {
    this.title = title;
    this.options = options;
    this.multiSelect = multiSelect;
    this.step = step;
    this.cursor = 0;
    this.scroll = 0;
    this.selected = new Set();
    this.total = options.length;
    this.lastScroll = -1;
    this.message = "";
  }

  get visible() {
    return getVisibleItems(this.total);
  }

  get firstItemRow() {
    return 7;
  }

  getItemRow(index) {
    return this.firstItemRow + (index - this.scroll);
  }

  updateScroll() {
    let needsFullRedraw = false;
    const maxScroll = Math.max(0, this.total - this.visible);
    
    if (this.cursor < this.scroll) {
      this.scroll = this.cursor;
      needsFullRedraw = true;
    } else if (this.cursor >= this.scroll + this.visible) {
      this.scroll = this.cursor - this.visible + 1;
      needsFullRedraw = true;
    }
    
    this.scroll = Math.max(0, Math.min(this.scroll, maxScroll));
    
    return needsFullRedraw;
  }

  drawHeader() {
    term.line(1, "");
    term.line(2, `  ${drawProgressLine(this.step)}`);
    term.line(3, "");
    term.line(4, `  ${c.bold}${c.white}${this.title}${c.reset}`);
    if (this.multiSelect) {
      term.line(5, `  ${c.cyan}${c.bold}[Space]${c.reset} ${c.dim}Toggle${c.reset}  ${c.cyan}${c.bold}[A]${c.reset} ${c.dim}All${c.reset}  ${c.cyan}${c.bold}[N]${c.reset} ${c.dim}None${c.reset}  ${c.yellow}${c.bold}[Enter]${c.reset} ${c.dim}Confirm${c.reset}`);
    } else {
      term.line(5, `  ${c.cyan}${c.bold}[Up/Down]${c.reset} ${c.dim}Move${c.reset}  ${c.yellow}${c.bold}[Enter]${c.reset} ${c.dim}Select${c.reset}`);
    }
  }

  drawScrollIndicators() {
    const upRow = 6;
    const downRow = this.firstItemRow + this.visible;
    
    if (this.scroll > 0) {
      term.line(upRow, `  ${c.dim}... ${this.scroll} more above${c.reset}`);
    } else {
      term.line(upRow, "");
    }
    
    const lastVisible = Math.min(this.scroll + this.visible, this.total);
    const below = this.total - lastVisible;
    if (below > 0) {
      term.line(downRow, `  ${c.dim}... ${below} more below${c.reset}`);
    } else {
      term.line(downRow, "");
    }
  }

  drawItem(index) {
    if (index < this.scroll || index >= this.scroll + this.visible) return;
    
    const row = this.getItemRow(index);
    const opt = this.options[index];
    const isCursor = index === this.cursor;
    
    let line = "";
    if (this.multiSelect) {
      const checked = this.selected.has(opt.key);
      if (isCursor) {
        const marker = checked ? `${c.green}[x]` : `[ ]`;
        line = `  ${c.cyan}${c.bold}> ${marker} ${opt.label}${c.reset}`;
      } else {
        const marker = checked ? `[x]` : `[ ]`;
        line = checked ? `    ${c.green}${marker} ${opt.label}${c.reset}` : `    ${marker} ${opt.label}`;
      }
    } else {
      if (isCursor) {
        line = `  ${c.cyan}${c.bold}> ${opt.label}${c.reset}`;
      } else {
        line = `    ${c.dim}${opt.label}${c.reset}`;
      }
    }
    
    term.line(row, line);
  }

  drawAllItems() {
    for (let i = this.scroll; i < this.scroll + this.visible && i < this.total; i++) {
      this.drawItem(i);
    }
  }

  drawStatus() {
    const statusRow = this.firstItemRow + this.visible + 1;
    const msgRow = this.firstItemRow + this.visible + 2;
    
    if (this.multiSelect) {
      term.line(statusRow, `  ${c.dim}[${this.cursor + 1}/${this.total}]  Selected: ${this.selected.size}${c.reset}`);
    } else {
      term.line(statusRow, `  ${c.dim}[${this.cursor + 1}/${this.total}]${c.reset}`);
    }
    
    if (this.message) {
      term.line(msgRow, `  ${c.yellow}[!] ${this.message}${c.reset}`);
    } else {
      term.line(msgRow, "");
    }
  }

  clearMessage() {
    this.message = "";
    const msgRow = this.firstItemRow + this.visible + 2;
    term.line(msgRow, "");
  }

  showMessage(msg) {
    this.message = msg;
    const msgRow = this.firstItemRow + this.visible + 2;
    term.line(msgRow, `  ${c.yellow}[!] ${msg}${c.reset}`);
  }

  fullDraw() {
    term.clear();
    term.hideCursor();
    this.updateScroll();
    this.drawHeader();
    this.drawScrollIndicators();
    this.drawAllItems();
    this.drawStatus();
    this.lastScroll = this.scroll;
  }

  partialDraw(prevCursor) {
    this.clearMessage();
    const scrollChanged = this.updateScroll();
    
    if (scrollChanged || this.lastScroll !== this.scroll) {
      this.drawHeader();
      this.drawScrollIndicators();
      this.drawAllItems();
      this.lastScroll = this.scroll;
    } else {
      if (prevCursor !== this.cursor) {
        this.drawItem(prevCursor);
        this.drawItem(this.cursor);
      }
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
            this.showMessage("Please select at least 1 option");
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

function confirm(message) {
  return new Promise((resolve) => {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes" || answer === "");
    });
  });
}

module.exports = {
  c,
  term,
  Menu,
  confirm,
  drawProgressLine,
};
