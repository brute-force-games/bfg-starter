import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Counter } from "../../src/components/Counter";

/**
 * The example's island (src/components/Counter.tsx), tested through the shared test preset as a
 * person uses it: found by its role and name (Testing Library), pressed as a user does
 * (user-event), never by firing DOM events by hand.
 */

describe("the counter", () => {
  it("counts each press", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Counter />);
    // Act
    await user.click(screen.getByRole("button", { name: "Pressed 0 times" }));
    await user.click(screen.getByRole("button", { name: "Pressed 1 times" }));
    // Assert
    expect(screen.getByRole("button", { name: "Pressed 2 times" })).toBeInTheDocument();
  });
});
