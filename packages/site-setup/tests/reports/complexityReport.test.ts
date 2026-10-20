import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  complexitySarif,
  nodeComplexityPorts,
  SITE_COMPLEXITY,
  renderSarif,
  writeComplexityReport,
  type Command,
  type ComplexityPorts,
} from "../../src/reports/complexityReport.ts";

/**
 * A run's complexity report (src/reports/complexityReport.ts): oxlint's SARIF kept, then rendered by
 * sarif-explorer; then the ports a site uses, on a real folder, with node standing in for the
 * tools.
 */

const PATHS = { sarif: "/r/complexity/complexity.sarif", html: "/r/complexity/index.html" };

/** Ports that record what they ran and wrote. */
interface RecordedPorts {
  readonly ports: ComplexityPorts;
  readonly ran: Command[];
  readonly written: { path: string; text: string }[];
}

/** Ports printing `sarif` for oxlint and exiting `rendered` from sarif-explorer, recording all. */
function recorded(sarif: string, rendered: number): RecordedPorts {
  const ran: Command[] = [];
  const written: { path: string; text: string }[] = [];
  const ports: ComplexityPorts = {
    output: (command) => {
      ran.push(command);
      return sarif;
    },
    run: (command) => {
      ran.push(command);
      return rendered;
    },
    write: (path, text) => {
      written.push({ path, text });
    },
  };
  return { ports, ran, written };
}

describe("the complexity report", () => {
  it("keeps oxlint's SARIF, then renders it to HTML", () => {
    // Arrange
    const { ports, ran, written } = recorded('{"runs":[]}', 0);
    // Act
    const exit = writeComplexityReport(SITE_COMPLEXITY, PATHS, ports);
    // Assert
    expect(exit).toBe(0);
    expect(written).toEqual([{ path: PATHS.sarif, text: '{"runs":[]}' }]);
    expect(ran).toEqual([complexitySarif(SITE_COMPLEXITY), renderSarif(PATHS.sarif, PATHS.html)]);
  });

  it("fails as the rendering does", () => {
    expect(writeComplexityReport(SITE_COMPLEXITY, PATHS, recorded("{}", 3).ports)).toBe(3);
  });

  it("asks oxlint for complexity as SARIF, and sarif-explorer for HTML", () => {
    expect(
      complexitySarif({ config: "lint/complexity.json", sources: ["src", "tools"] }).args,
    ).toEqual(["oxlint", "-c", "lint/complexity.json", "--format", "sarif", "src", "tools"]);
    expect(renderSarif("in.sarif", "out.html").args).toEqual([
      "sarif-explorer",
      "--input",
      "in.sarif",
      "--output",
      "out.html",
    ]);
  });
});

/** node, running `script`: a stand-in for a tool. */
const node = (script: string): Command => ({ program: process.execPath, args: ["-e", script] });

describe("the complexity report's ports on a real folder", () => {
  let root = "";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "bfg-site-complexity-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("reads what a command prints, run in the site", () => {
    // Act
    const printed = nodeComplexityPorts(root).output(node("process.stdout.write(process.cwd())"));
    // Assert
    expect(printed).toContain("bfg-site-complexity-");
  });

  it("gives a command's exit code", () => {
    expect(nodeComplexityPorts(root).run(node("process.exit(4)"))).toBe(4);
  });

  it("counts a command killed by a signal as failed", () => {
    expect(nodeComplexityPorts(root).run(node("process.kill(process.pid, 'SIGKILL')"))).toBe(1);
  });

  it("writes a file, making its folder", () => {
    // Arrange
    const path = join(root, "complexity", "complexity.sarif");
    // Act
    nodeComplexityPorts(root).write(path, "{}");
    // Assert
    expect(readFileSync(path, "utf8")).toBe("{}");
  });
});
