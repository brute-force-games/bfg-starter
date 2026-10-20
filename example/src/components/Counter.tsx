import { useState } from "react";

/** A React island: a button that counts its presses. */
export function Counter(): React.JSX.Element {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        setCount(count + 1);
      }}
    >
      Pressed {count} times
    </button>
  );
}
