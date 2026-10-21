import { nodeIoWith, runAudit, runVerify } from "@brute-force-games/audit-cli";

/**
 * The record commands' runner (src/bin/recordRunner.ts): what a "tsx" games loader starts, its
 * command line run by audit-cli's command of that name, its exit code the process's.
 */

vi.mock("@brute-force-games/audit-cli", () => ({
  nodeIoWith: vi.fn<typeof nodeIoWith>((write) => {
    write("io made");
    return {
      readFile: () => Promise.resolve(new Uint8Array()),
      loadGames: () => Promise.resolve({ kind: "none" }),
      write,
    };
  }),
  runAudit: vi.fn<typeof runAudit>(() => Promise.resolve(1)),
  runVerify: vi.fn<typeof runVerify>(() => Promise.resolve(0)),
}));

const argv = process.argv;

afterEach(() => {
  process.argv = argv;
  process.exitCode = undefined;
  vi.resetModules();
  vi.clearAllMocks();
});

/** Runs the runner as a process would with `args`, its output kept. */
async function runnerWith(args: readonly string[]): Promise<string[]> {
  process.argv = ["node", "recordRunner.ts", ...args];
  const written: string[] = [];
  vi.spyOn(process.stdout, "write").mockImplementation((text) => {
    written.push(String(text));
    return true;
  });
  await import("../../src/bin/recordRunner.ts");
  return written;
}

describe("the record commands' runner", () => {
  it("audits with audit-cli, writing to standard output, and exits with its code", async () => {
    // Act
    const written = await runnerWith(["audit", "game.cbor", "--json"]);
    // Assert
    expect(runAudit).toHaveBeenCalledWith(["game.cbor", "--json"], expect.anything());
    expect(runVerify).not.toHaveBeenCalled();
    expect(written).toEqual(["io made\n"]);
    expect(process.exitCode).toBe(1);
  });

  it("checks a proof with audit-cli's verify", async () => {
    // Act
    await runnerWith(["check-proof", "proof.cbor"]);
    // Assert
    expect(runVerify).toHaveBeenCalledWith(["proof.cbor"], expect.anything());
    expect(process.exitCode).toBe(0);
  });
});
