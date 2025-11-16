import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const reportsRoot = path.join(projectRoot, "reports", "vitest");

const VITEST_BIN_NAME = process.platform === "win32" ? "vitest.cmd" : "vitest";

const readWorkspaces = async () => {
  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJsonRaw = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonRaw);

  const workspaces = packageJson.workspaces ?? [];

  if (!Array.isArray(workspaces)) {
    throw new Error("Expected workspaces to be an array in package.json");
  }

  return workspaces;
};

const sanitiseName = (identifier) => identifier.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "root";

const resolveVitestBin = async (cwd) => {
  const localCandidate = path.join(cwd, "node_modules", ".bin", VITEST_BIN_NAME);

  try {
    await fs.access(localCandidate);
    return localCandidate;
  } catch {
    const rootCandidate = path.join(projectRoot, "node_modules", ".bin", VITEST_BIN_NAME);
    await fs.access(rootCandidate);
    return rootCandidate;
  }
};

const runCommand = (command, args, cwd, displayName) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { cwd, stdio: "inherit", env: process.env });

  child.on("exit", (code) => {
    if (typeof code === "number") {
      resolve(code);
      return;
    }

    const formattedName = displayName ?? cwd;
    reject(new Error(`Command received non-numeric exit in ${formattedName}`));
  });

  child.on("error", (error) => {
    reject(error);
  });
});

const prepareReportsDirectory = async () => {
  await fs.rm(reportsRoot, { recursive: true, force: true });
  await fs.mkdir(reportsRoot, { recursive: true });
};

const createTargets = async () => {
  const workspaces = await readWorkspaces();

  const rootTarget = {
    id: "root",
    displayName: "root",
    cwd: projectRoot,
    reportFile: path.join(reportsRoot, "root.json"),
  };

  const workspaceTargets = workspaces.map((workspacePath) => {
    const absolutePath = path.join(projectRoot, workspacePath);
    const name = sanitiseName(workspacePath);
    const reportFile = path.join(reportsRoot, `${name}.json`);

    return {
      id: name,
      displayName: workspacePath,
      cwd: absolutePath,
      reportFile,
    };
  });

  return [rootTarget, ...workspaceTargets];
};

const runTestsForTarget = async ({ cwd, displayName, reportFile }) => {
  console.log(`\n▶︎ Running Vitest in ${displayName}`);
  const vitestBin = await resolveVitestBin(cwd);
  const args = [
    "run",
    "--reporter=default",
    "--reporter=json",
    `--outputFile=${reportFile}`,
    "--passWithNoTests",
  ];

  const exitCode = await runCommand(vitestBin, args, cwd, displayName);

  if (exitCode !== 0) {
    console.warn(`⚠︎ Vitest reported failures in ${displayName}`);
  }

  return exitCode;
};

const loadRunReport = async (reportFile) => {
  try {
    const raw = await fs.readFile(reportFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`⚠︎ Unable to read report ${path.relative(projectRoot, reportFile)}`, error);
    return null;
  }
};

const combineSummaries = (reports) => {
  return reports.reduce(
    (accumulator, report) => {
      if (!report) {
        return accumulator;
      }

      accumulator.numTotalTestSuites += report.numTotalTestSuites ?? 0;
      accumulator.numPassedTestSuites += report.numPassedTestSuites ?? 0;
      accumulator.numFailedTestSuites += report.numFailedTestSuites ?? 0;
      accumulator.numTotalTests += report.numTotalTests ?? 0;
      accumulator.numPassedTests += report.numPassedTests ?? 0;
      accumulator.numFailedTests += report.numFailedTests ?? 0;
      accumulator.numPendingTests += report.numPendingTests ?? 0;

      return accumulator;
    },
    {
      numTotalTestSuites: 0,
      numPassedTestSuites: 0,
      numFailedTestSuites: 0,
      numTotalTests: 0,
      numPassedTests: 0,
      numFailedTests: 0,
      numPendingTests: 0,
    }
  );
};

const deriveFailingDetails = (reports) => {
  const grouped = new Map();

  reports.forEach((report) => {
    if (!report || !Array.isArray(report.testResults)) {
      return;
    }

    report.testResults
      .filter((result) => result.status === "failed" || result.status === "fail")
      .forEach((result) => {
        const filePath = result.name ?? result.file ?? "<unknown>";
        const failing = (result.assertionResults ?? []).filter(
          (assertion) => assertion.status === "failed" || assertion.status === "fail"
        ).length;

        grouped.set(filePath, (grouped.get(filePath) ?? 0) + failing);
      });
  });

  return Array.from(grouped.entries()).map(([filePath, failedCount]) => ({
    filePath,
    failedCount,
  }));
};

const outputSummary = (summary) => {
  const {
    numFailedTestSuites,
    numPassedTestSuites,
    numTotalTestSuites,
    numFailedTests,
    numPassedTests,
    numTotalTests,
    numPendingTests,
  } = summary;

  console.log("\nSummary");
  console.log(` Test Suites  ${numFailedTestSuites} failed | ${numPassedTestSuites} passed | ${numTotalTestSuites} total`);
  console.log(` Tests        ${numFailedTests} failed | ${numPassedTests} passed | ${numTotalTests} total | ${numPendingTests} pending`);
};

const run = async () => {
  let encounteredFailure = false;

  try {
    await prepareReportsDirectory();

    const targets = await createTargets();
    const reports = [];

    for (const target of targets) {
      const exitCode = await runTestsForTarget(target);
      if (exitCode !== 0) {
        encounteredFailure = true;
      }

      const report = await loadRunReport(target.reportFile);
      reports.push(report);
    }

    const summary = combineSummaries(reports);
    outputSummary(summary);

    const failingDetails = deriveFailingDetails(reports);

    if (failingDetails.length > 0) {
      encounteredFailure = true;
      console.log("\n❌ Failing test files:");
      failingDetails.forEach(({ filePath, failedCount }) => {
        console.log(` - ${path.relative(projectRoot, filePath)} (${failedCount} failed)`);
      });
    } else {
      console.log("\n✅ All test files passed");
    }
  } catch (error) {
    console.error("\n❌ Test aggregation failed");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    return;
  }

  if (encounteredFailure) {
    process.exitCode = 1;
  }
};

await run();
