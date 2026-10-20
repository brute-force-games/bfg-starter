import { fireEvent, render, screen } from "@testing-library/react";
import { Counter } from "../../src/components/Counter";

/** The example's island (src/components/Counter.tsx), tested through the shared test preset. */

describe("the counter", () => {
  it("counts each press", () => {
    // Arrange
    render(<Counter />);
    const button = screen.getByRole("button");
    // Act
    fireEvent.click(button);
    fireEvent.click(button);
    // Assert
    expect(button).toHaveTextContent("Pressed 2 times");
  });
});
