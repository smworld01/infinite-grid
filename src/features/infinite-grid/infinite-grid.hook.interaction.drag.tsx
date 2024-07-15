import { useEffect } from "react";
import { Id } from "./infinite-grid.type";
import { DATA_TRANSFER_TYPE } from "./infinite-grid.hook.interaction.type";

export default function useInfiniteGridInteractionDrag(props: {
  id: Id;
  ref: React.RefObject<HTMLDivElement>;
}) {
  const { id, ref } = props;

  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) return;

    const onDragStart = (e: DragEvent) => {
      e.dataTransfer?.setData(DATA_TRANSFER_TYPE, id);
    };

    currentRef.addEventListener("dragstart", onDragStart);

    return () => {
      currentRef.removeEventListener("dragstart", onDragStart);
    };
  }, [id, ref]);

  useEffect(() => {
    const currentRef = ref.current;

    if (!currentRef) return;

    const onDragEnd = (e: DragEvent) => {
      e.dataTransfer?.clearData(DATA_TRANSFER_TYPE);
    };

    currentRef.addEventListener("dragend", onDragEnd);

    return () => {
      currentRef.removeEventListener("dragend", onDragEnd);
    };
  }, [ref]);
}
