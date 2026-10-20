import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Counter } from "../../src/components/Counter";

/**
 * The example's island (src/components/Counter.tsx), as a property: for every number of presses
 * up to a bound, it shows that number. Exhaustive over the range, so it needs no generator
 * library: the property stage's proof that the setup runs a site's property tests.
 */

const MOST_PRESSES = 30;

describe("the counter, for any number of presses", () => {
  it(`shows how many, for every count from 0 to ${String(MOST_PRESSES)}`, () => {
    for (let presses = 0; presses <= MOST_PRESSES; presses += 1) {
      // Arrange
      render(<Counter />);
      const button = screen.getByRole("button");
      // Act
      for (let press = 0; press < presses; press += 1) {
        fireEvent.click(button);
      }
      // Assert
      expect(button).toHaveTextContent(`Pressed ${String(presses)} times`);
      cleanup();
    }
  });
});
