import { useState } from "react";
import WindowItem from ".";

export default function WindowSample() {
  const [isDisabled, setIsDisabled] = useState(true);

  if (!isDisabled) {
    return null;
  }

  return (
    <WindowItem title="Hello, world!" onClose={() => setIsDisabled(false)}>
      <p>This is a window.</p>
    </WindowItem>
  );
}
