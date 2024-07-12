export type Id = string;
export type GridLeafItem = {
  parent: Id;

  isLeaf: true;
};
export type GridParentItem = {
  parent: Id | null;

  isParent: true;
  orientation: Orientation;

  children: Id[];
};
export interface GridRootItem extends GridParentItem {
  parent: null;
}
export interface GridStructureItem extends GridParentItem {
  parent: Id;
}

export type GridItem = GridLeafItem | GridParentItem;
export type GridItemWithRoot = GridItem | GridRootItem;
export interface GridItems extends Record<string, GridItem> {
  root: GridRootItem;
}

export function isGridLeafItem(item: GridItem): item is GridLeafItem {
  return "isLeaf" in item;
}
export function isGridParentItem(item: GridItem): item is GridParentItem {
  return "isParent" in item;
}
export function isGridRootItem(item: GridItem): item is GridRootItem {
  return isGridParentItem(item) && item.parent === null;
}
export function isGridStructureItem(item: GridItem): item is GridStructureItem {
  return isGridParentItem(item) && item.parent !== null;
}

export type Orientation = "horizontal" | "vertical";
export type Position = "left" | "right" | "top" | "bottom";

export const GRID_ROOT_ID = "root";
