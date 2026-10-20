import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nodeProcesses, portIn } from "../../src/bin/nodeProcesses.ts";
import type { Check } from "../../src/bin/ports.ts";

/** The real processes (src/bin/nodeProcesses.ts), run as small Node scripts; no server is started. */

const root = mkdtempSync(join(tmpdir(), "bfg-site-processes-"));
const processes = nodeProcesses(root, { ...process.env, FROM_ENV: "env" });
const nodeRunning = (name: string, script: string, env: Record<string, string> = {}): Check => ({
  name,
  program: process.execPath,
  args: ["-e", script],
  env,
});
const logIn = (name: string): string =>
  join(mkdtempSync(join(tmpdir(), "bfg-site-log-")), `${name}.log`);

/** What a program that isn't there prints: it can't be started. */
const outputOfNoProgram = (): string =>
  processes.output({ program: "bfg-site-no-such-program", args: [] });

describe("the real processes", () => {
  it("run a check in the site, its output and errors to its log, its variables over the environment's", async () => {
    // Arrange
    const log = logIn("run");
    const check = nodeRunning(
      "run",
      "console.log(process.cwd(), process.env.FROM_ENV, process.env.OWN); console.error('oops'); process.exit(3)",
      { OWN: "own" },
    );
    // Act
    const ended = await processes.run(check, log);
    // Assert
    expect(ended.status).toBe(3);
    expect(readFileSync(log, "utf8")).toContain("env own");
    expect(readFileSync(log, "utf8")).toContain("oops");
  });

  it("run a check here, saying how it ended", () => {
    // Act
    const ended = processes.runHere(nodeRunning("here", "process.exit(2)"));
    // Assert
    expect(ended.status).toBe(2);
  });

  it("give what a command prints, whatever its exit code", () => {
    // Act
    const printed = processes.output({
      program: process.execPath,
      args: ["-e", "process.stdout.write('out'); process.exit(1)"],
    });
    // Assert
    expect(printed).toBe("out");
  });

  it("throw for a command that can't be started", () => {
    // Act, Assert
    expect(outputOfNoProgram).toThrow(/ENOENT/u);
  });
});

describe("the real processes left running", () => {
  it("start a process and stop it, letting go of their own exit hook", async () => {
    // Arrange
    const hooks = process.listenerCount("exit");
    const running = processes.start(
      nodeRunning("server", "setInterval(() => {}, 1000)"),
      logIn("server"),
    );
    // Act
    const before = running.state();
    running.stop();
    // Assert
    expect(before).toEqual({ kind: "running" });
    await vi.waitFor(() => {
      expect(running.state().kind).toBe("ended");
    });
    expect(process.listenerCount("exit")).toBe(hooks);
  });

  it("see a started process end of itself, and don't stop it after", async () => {
    // Arrange
    const running = processes.start(nodeRunning("quick", "process.exit(5)"), logIn("quick"));
    await vi.waitFor(() => {
      expect(running.state()).toEqual({ kind: "ended", status: 5 });
    });
    // Act
    running.stop();
    // Assert
    expect(running.state()).toEqual({ kind: "ended", status: 5 });
  });

  it("find a free port, where nothing answers", async () => {
    // Arrange
    const port = await processes.freePort();
    // Act
    const answer = await processes.answers(`http://127.0.0.1:${String(port)}`);
    // Assert
    expect(port).toBeGreaterThan(0);
    expect(answer).toBe("down");
  });

  it("pause", async () => {
    // Act
    const paused = processes.pause(1);
    // Assert
    await expect(paused).resolves.toBeUndefined();
  });
});

describe("a listening socket's port", () => {
  it("is a TCP socket's", () => {
    // Act
    const port = portIn({ address: "127.0.0.1", family: "IPv4", port: 4999 });
    // Assert
    expect(port).toBe(4999);
  });

  it.each([
    { what: "a pipe's", address: "/tmp/socket" },
    { what: "a closed one's", address: null },
  ])("isn't there in $what address", ({ address }) => {
    // Act
    const reading = (): number => portIn(address);
    // Assert
    expect(reading).toThrow("no TCP port in");
  });
});
