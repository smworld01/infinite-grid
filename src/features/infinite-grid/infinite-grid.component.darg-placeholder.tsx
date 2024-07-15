import { RefObject } from "react";
import { Id } from "./infinite-grid.type";
import useInfiniteGridInteractionDrop from "./infinite-grid.hook.interaction.drop";

import "./infinite-grid.component.drag-placeholder.css";

export default function InfiniteGridDragPlaceholder(props: {
  id: Id;
  containerRef: RefObject<HTMLDivElement>;
}) {
  const { id, containerRef } = props;
  const { placeholderPosition } = useInfiniteGridInteractionDrop({
    id,
    containerRef,
  });

  return <div className={`drag-placeholder ${placeholderPosition}`} />;
}
