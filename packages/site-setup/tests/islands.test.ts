// @vitest-environment jsdom
import { allIslandsHydrated, whenAllIslandsHydrated } from "../src/components/islands.ts";

/** Whether a page's islands have all hydrated (src/components/islands.ts), and waiting until they have. */

/** A page with islands, each still showing the server's HTML (`ssr`) or hydrated. */
function pageWith(...islands: readonly ("ssr" | "hydrated")[]): HTMLElement[] {
  document.body.innerHTML = "";
  return islands.map((state) => {
    const island = document.createElement("astro-island");
    if (state === "ssr") {
      island.setAttribute("ssr", "");
    }
    document.body.append(island);
    return island;
  });
}

/** The next turn, after the MutationObserver's callbacks have run. */
const settled = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

afterEach(() => {
  document.body.innerHTML = "";
});

describe("a page's islands", () => {
  it.each([
    { what: "none at all", islands: [], all: true },
    { what: "every one hydrated", islands: ["hydrated", "hydrated"] as const, all: true },
    { what: "one still from the server", islands: ["hydrated", "ssr"] as const, all: false },
  ])("are all hydrated: $all, with $what", ({ islands, all }) => {
    pageWith(...islands);
    expect(allIslandsHydrated(document)).toBe(all);
  });
});

describe("waiting for every island", () => {
  it("is over at once when they've hydrated", () => {
    // Arrange
    pageWith("hydrated");
    const done = vi.fn<() => void>();
    // Act
    whenAllIslandsHydrated(document, done)();
    // Assert
    expect(done).toHaveBeenCalledOnce();
  });

  it("ends when the last island hydrates, not the first, and once", async () => {
    // Arrange
    const [first, last] = pageWith("ssr", "ssr");
    const done = vi.fn<() => void>();
    whenAllIslandsHydrated(document, done);
    // Act
    first?.removeAttribute("ssr");
    await settled();
    const afterFirst = done.mock.calls.length;
    last?.removeAttribute("ssr");
    await settled();
    document.body.append(document.createElement("p"));
    await settled();
    // Assert
    expect(afterFirst).toBe(0);
    expect(done).toHaveBeenCalledOnce();
  });

  it("stops when told to, before the islands hydrate", async () => {
    // Arrange
    const [island] = pageWith("ssr");
    const done = vi.fn<() => void>();
    const stop = whenAllIslandsHydrated(document, done);
    // Act
    stop();
    island?.removeAttribute("ssr");
    await settled();
    // Assert
    expect(done).not.toHaveBeenCalled();
  });
});
