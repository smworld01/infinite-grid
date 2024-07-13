import { useContext, useMemo } from "react";
import {
  InifniteGridContext,
  InfiniteGridContext,
} from "./infinite-grid.component.provider";

export function useInfiniteGridSelector<T>(
  selector: (state: InifniteGridContext) => T
): T {
  const context = useContext(InfiniteGridContext);
  if (context === null) {
    throw new Error(
      "useInfiniteGridSelector must be used within an InfiniteGridProvider"
    );
  }

  return useMemo(() => selector(context), [context, selector]);
}
