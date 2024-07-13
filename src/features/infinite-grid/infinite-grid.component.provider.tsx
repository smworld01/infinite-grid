import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { GridItems } from "./infinite-grid.type";
import InfiniteGridFunction from "./infinite-grid.function";

export interface InfiniteGridProps {
  initialGridItems: GridItems;
}

type GridFunctions = ReturnType<typeof InfiniteGridFunction>;

type FunctionWrapper = <T extends keyof GridFunctions>(
  fn: GridFunctions[T]
) => (...args: Parameters<GridFunctions[T]>) => void;

export interface InifniteGridContext extends GridFunctions {
  gridItems: GridItems;
}

export const InfiniteGridContext = createContext<InifniteGridContext | null>(
  null
);

export default function InfiniteGridProvider(
  props: PropsWithChildren<InfiniteGridProps>
) {
  const [gridItems, setGridItems] = useState<GridItems>(props.initialGridItems);

  const gridFunctions = useMemo(() => {
    const functions = InfiniteGridFunction(gridItems);

    const functionWrapper: FunctionWrapper =
      (fn) =>
      (...args) => {
        //@ts-expect-error - This is a hack to make the type checker happy
        const result = fn(...args);
        setGridItems(result);
      };

    const wrappedFunctions = Object.fromEntries(
      Object.entries(functions).map(([key, fn]) => [key, functionWrapper(fn)])
    ) as GridFunctions;

    return wrappedFunctions;
  }, [gridItems]);

  return (
    <InfiniteGridContext.Provider value={{ ...gridFunctions, gridItems }}>
      {props.children}
    </InfiniteGridContext.Provider>
  );
}
