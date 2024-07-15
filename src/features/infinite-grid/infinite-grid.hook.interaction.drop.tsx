import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteGridSelector } from "./infinite-grid.hook.selector";
import { Id, isGridLeafItem } from "./infinite-grid.type";
import {
  Position,
  DATA_TRANSFER_TYPE,
} from "./infinite-grid.hook.interaction.type";

export default function useInfiniteGridInteractionDrop(props: {
  id: Id;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const { id, containerRef: ref } = props;
  const gridItem = useInfiniteGridSelector((state) => state.gridItems[id]);
  const swapLeafItems = useInfiniteGridSelector((state) => state.swapLeafItems);
  const moveLeafItem = useInfiniteGridSelector((state) => state.moveLeafItem);
  const isNotLeaf = !isGridLeafItem(gridItem);

  const [position, setPosition] = useState<Position>(undefined);

  const isDraggingCounter = useRef(0);

  const currentDragPosition = useCallback(
    (e: DragEvent) => {
      if (ref.current) {
        const { top, right, bottom, left, height, width } =
          ref.current.getBoundingClientRect();

        const percent = 2 / 10;

        const horizontalArea = width * percent;
        const verticalArea = height * percent;

        const x = e.clientX;
        const y = e.clientY;

        if (x < left + horizontalArea) {
          return "left";
        } else if (x > right - horizontalArea) {
          return "right";
        } else if (y < top + verticalArea) {
          return "top";
        } else if (y > bottom - verticalArea) {
          return "bottom";
        } else {
          return "center";
        }
      }

      return "center";
    },
    [ref]
  );

  const isItemDragging = (e: DragEvent) =>
    e.dataTransfer?.types.some((type) => type === DATA_TRANSFER_TYPE);

  const onDragOver = useCallback(
    (e: DragEvent) => {
      const dropItem = isItemDragging(e);
      if (!dropItem) return;
      e.preventDefault();
      e.stopPropagation();

      if (!dropItem) return;

      const position = currentDragPosition(e);

      setPosition(position);
    },
    [currentDragPosition]
  );

  const onDropItem = useCallback(
    (e: DragEvent) => {
      isDraggingCounter.current = 0;
      const dataTransfer = e.dataTransfer;
      if (!dataTransfer) return;

      if (!dataTransfer.types.includes("seenario-window")) return;
      const dropItem = dataTransfer.getData("seenario-window");

      e.preventDefault();
      e.stopPropagation();

      setPosition(undefined);

      const position = currentDragPosition(e);
      const [targetId] = dropItem.split(" ");

      if (position === "center") {
        swapLeafItems(id, targetId);
      } else {
        if (id === targetId) return;

        moveLeafItem(targetId, {
          id,
          position,
        });
      }
    },
    [currentDragPosition, id, moveLeafItem, swapLeafItems]
  );

  const onDropItemMove = useCallback(
    (e: DragEvent) => {
      isDraggingCounter.current = 0;
      const dataTransfer = e.dataTransfer;
      if (!dataTransfer) return;

      if (!dataTransfer.types.includes(DATA_TRANSFER_TYPE)) return;

      e.preventDefault();
      e.stopPropagation();

      setPosition(undefined);

      const dropItem = dataTransfer.getData(DATA_TRANSFER_TYPE);
      if (dropItem === id) return;

      const position = currentDragPosition(e);

      if (position === "center") {
        swapLeafItems(id, dropItem);
      } else {
        moveLeafItem(dropItem, {
          id,
          position,
        });
      }
    },
    [currentDragPosition, id, moveLeafItem, swapLeafItems]
  );
  const onDragLeave = useCallback(() => {
    isDraggingCounter.current--;

    if (isDraggingCounter.current === 0) {
      setPosition(undefined);
    }
  }, []);
  const onDragEnter = useCallback(() => {
    isDraggingCounter.current++;
  }, []);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    if (isNotLeaf) return;

    currentRef.addEventListener("dragover", onDragOver);

    return () => {
      currentRef.removeEventListener("dragover", onDragOver);
    };
  }, [onDragOver, isNotLeaf, ref]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    if (isNotLeaf) return;

    currentRef.addEventListener("drop", onDropItem);

    return () => {
      currentRef.removeEventListener("drop", onDropItem);
    };
  }, [onDropItem, isNotLeaf, ref]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    if (isNotLeaf) return;

    currentRef.addEventListener("drop", onDropItemMove);

    return () => {
      currentRef.removeEventListener("drop", onDropItemMove);
    };
  }, [onDropItemMove, isNotLeaf, ref]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    if (isNotLeaf) return;

    currentRef.addEventListener("dragleave", onDragLeave);

    return () => {
      currentRef.removeEventListener("dragleave", onDragLeave);
    };
  }, [onDragLeave, isNotLeaf, ref]);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    if (isNotLeaf) return;

    currentRef.addEventListener("dragenter", onDragEnter);

    return () => {
      currentRef.removeEventListener("dragenter", onDragEnter);
    };
  }, [onDragEnter, isNotLeaf, ref]);

  return { placeholderPosition: position ?? "" };
}
