import { binding, given, then, when } from "cucumber-tsflow";
import { DataTable } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { BfgProtocolTypeSchema } from "../../../modules/bfg-engine/src/bfg-protocols/bfg-protocol-type";

interface ValidationFailure {
  code: string;
  path: (string | number)[];
  message: string;
}

@binding()
export class BfgProtocolTypeSteps {
  private protocolDefinition: Record<string, unknown> = {};
  private validationResult: ReturnType<typeof BfgProtocolTypeSchema.safeParse> | null = null;

  @given("a protocol definition:")
  public givenProtocolDefinition(table: DataTable) {
    const rows = table.rowsHash();
    this.protocolDefinition = {};

    Object.entries(rows).forEach(([key, rawValue]) => {
      if (rawValue === "(missing)") {
        return;
      }

      this.protocolDefinition[key] = rawValue;
    });
  }

  @when("I validate the protocol")
  public whenIValidateTheProtocol() {
    this.validationResult = BfgProtocolTypeSchema.safeParse(this.protocolDefinition);
  }

  @then("validation succeeds")
  public thenValidationSucceeds() {
    assert.ok(this.validationResult, "Validation result missing");
    assert.equal(this.validationResult.success, true, "Expected validation to succeed");
  }

  @then(/^the bootstrapString equals "([^"]+)"$/)
  public thenBootstrapStringEquals(expected: string) {
    assert.ok(this.validationResult?.success, "Validation did not succeed");
    assert.equal((this.validationResult as { success: true; data: Record<string, unknown> }).data.bootstrapString, expected);
  }

  @then(/^validation fails with code "([^"]+)" at path "([^"]+)"$/)
  public thenValidationFailsWith(code: string, path: string) {
    const failure = this.extractFirstIssue();

    assert.equal(failure?.code, code, `Expected failure code ${code}`);
    assert.equal(failure?.path?.[0], path, `Expected failure path ${path}`);
  }

  @then(/^the message contains "([^"]+)"$/)
  public thenMessageContains(fragment: string) {
    const failure = this.extractFirstIssue();

    assert.ok(failure?.message.includes(fragment), `Expected message to contain "${fragment}" but was "${failure?.message}"`);
  }

  private extractFirstIssue(): ValidationFailure | undefined {
    assert.ok(this.validationResult, "Validation result missing");
    assert.equal(this.validationResult.success, false, "Expected validation to fail");

    const [issue] = this.validationResult.error.issues;

    return issue as ValidationFailure | undefined;
  }
}


