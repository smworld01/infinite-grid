import { forwardRef } from "react";

const WindowContent = forwardRef<HTMLDivElement, React.PropsWithChildren>(
  (props, ref) => (
    <section ref={ref} className="window-content">
      {props.children}
    </section>
  )
);

WindowContent.displayName = "WindowContent";

export default WindowContent;
