Feature: BFG protocol type validation
  Schema validation for BfgProtocolTypeSchema should distinguish valid and invalid protocol definitions.

  Scenario: Valid protocol parses successfully
    Given a protocol definition:
      | bfgProtocolHandlerPrefix | bfg             |
      | dataSource               | p2p             |
      | encodingFormat           | json            |
      | semanticType             | json            |
      | bootstrapString          | game://bootstrap |
    When I validate the protocol
    Then validation succeeds
    And the bootstrapString equals "game://bootstrap"

  Scenario Outline: Invalid enum values are rejected
    Given a protocol definition:
      | bfgProtocolHandlerPrefix | bfg       |
      | dataSource               | <source>  |
      | encodingFormat           | json      |
      | semanticType             | json      |
      | bootstrapString          | bootstrap |
    When I validate the protocol
    Then validation fails with code "invalid_value" at path "<path>"
    And the message contains "<message>"

    Examples:
      | source     | path       | message                                                |
      | bluetooth  | dataSource | expected one of "p2p"|"http"|"tb"|"address-bar"|"file" |
      | p2p        | encodingFormat | expected one of "json"|"text"|"binary"      |
      | p2p        | semanticType  | expected one of "json"|"text"|"binary"      |

  Scenario: Missing bootstrapString fails validation
    Given a protocol definition:
      | bfgProtocolHandlerPrefix | bfg  |
      | dataSource               | p2p  |
      | encodingFormat           | json |
      | semanticType             | json |
      | bootstrapString          | (missing) |
    When I validate the protocol
    Then validation fails with code "invalid_type" at path "bootstrapString"
    And the message contains "expected string"


