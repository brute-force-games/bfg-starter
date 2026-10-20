import { act, fireEvent, screen } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Counter } from "../../src/components/Counter";

/**
 * The example's island as a page delivers it (src/pages/index.astro's `client:load`): rendered to
 * HTML on the server, then hydrated in the browser, where it counts presses. The integration
 * stage's proof that a site's island works across both.
 */

let root: Root | undefined;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = undefined;
  document.body.innerHTML = "";
});

describe("the counter island", () => {
  it("is served as HTML, then hydrated, and counts presses", () => {
    // Arrange
    const island = document.createElement("div");
    island.innerHTML = renderToString(<Counter />);
    document.body.append(island);
    const served = screen.getByRole("button");
    act(() => {
      root = hydrateRoot(island, <Counter />);
    });
    // Act
    fireEvent.click(served);
    // Assert
    expect(screen.getByRole("button")).toBe(served);
    expect(served).toHaveTextContent("Pressed 1 times");
  });
});
