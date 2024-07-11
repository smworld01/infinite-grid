import { forwardRef } from "react";
import WindowContent from "./window.content";
import WindowHeader from "./window.header";

import "./index.css";

export interface WindowProps {
  title: string;
  onClose: () => void;
}

const WindowItem = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<WindowProps>
>((props, ref) => (
  <div className="window-container" ref={ref}>
    <WindowHeader title={props.title} onClose={props.onClose} />
    <WindowContent>{props.children}</WindowContent>
  </div>
));

WindowItem.displayName = "WindowItem";

export default WindowItem;
