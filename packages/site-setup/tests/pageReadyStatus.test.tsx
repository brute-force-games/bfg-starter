// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { PageReadyStatus, pageReadiness } from "../src/components/PageReadyStatus.tsx";

/**
 * A page's ready status (src/components/PageReadyStatus.tsx): "Loading…" in the server's HTML and
 * until every island has hydrated, the status's own and a slower one beside it, then "Ready".
 */

let root: Root | undefined;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = undefined;
  document.body.innerHTML = "";
});

/** The page's status line's text; a page without one fails the test. */
function statusText(): string {
  const status = document.querySelector('output[aria-label="Page status"]');
  if (status === null) {
    throw new Error("the page has no status");
  }
  return status.textContent;
}

describe("a page's ready status", () => {
  it("is loading in the server's HTML", () => {
    expect(renderToString(<PageReadyStatus />)).toContain("Loading…");
  });

  it("stays loading while another island hasn't hydrated, then says Ready", async () => {
    // Arrange: the status's island, and a slower one still from the server.
    const slower = document.createElement("astro-island");
    slower.setAttribute("ssr", "");
    const own = document.createElement("div");
    document.body.append(own, slower);
    // Act
    act(() => {
      root = createRoot(own);
      root.render(<PageReadyStatus />);
    });
    const before = statusText();
    await act(async () => {
      slower.removeAttribute("ssr");
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });
    // Assert
    expect(before).toBe("Loading…");
    expect(statusText()).toBe("Ready");
  });

  it("is named as room-ui's ReadyStatus is, the page's one status, an <output> (role status)", () => {
    expect(renderToString(<PageReadyStatus />)).toMatch(/^<output aria-live="polite" aria-label="Page status">/u);
  });

  it("is room-view's loading, then ready", () => {
    expect([pageReadiness(false), pageReadiness(true)]).toEqual([{ kind: "loading" }, { kind: "ready" }]);
  });
});
