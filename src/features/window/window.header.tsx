import { forwardRef } from "react";

export interface WindowHeaderProps {
  title: string;
  onClose: () => void;
}

const WindowHeader = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<WindowHeaderProps>
>((props, ref) => (
  <div ref={ref} className="window-header">
    <h2>{props.title}</h2>
    <button onClick={props.onClose}>Close</button>
  </div>
));

WindowHeader.displayName = "WindowHeader";

export default WindowHeader;
