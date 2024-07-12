import { nanoid } from "nanoid";
import {
  Id,
  GridLeafItem,
  isGridLeafItem,
  GridParentItem,
  GridRootItem,
  isGridRootItem,
  isGridParentItem,
  Position,
  GridItems,
  isGridStructureItem,
  GridItem,
} from "./infinite-grid.type";
import { produce } from "immer";

function _findItem(gridItems: GridItems, id: Id): GridItem {
  const item = gridItems[id];
  if (!item) throw new Error(`No item with id ${id}`);
  return item;
}

function _findLeafItem(gridItems: GridItems, id: Id): GridLeafItem {
  const item = _findItem(gridItems, id);
  if (!isGridLeafItem(item))
    throw new Error(`Item with id ${id} is not a leaf item`);
  return item;
}

function _findParent(
  gridItems: GridItems,
  id: Id
): GridParentItem | GridRootItem | null {
  const item = _findItem(gridItems, id);

  if (!isGridStructureItem(item)) return null;

  const parent = _findItem(gridItems, item.parent);
  if (isGridLeafItem(parent))
    throw new Error(`Parent of item with id ${id} is not a structure`);

  return parent;
}

function _findParentOfLeafItem(
  gridItems: GridItems,
  leafItem: GridLeafItem
): GridParentItem | GridRootItem {
  const parent = _findItem(gridItems, leafItem.parent);
  if (!isGridParentItem(parent))
    throw new Error(
      `Parent of item with id ${leafItem.parent} is not a structure`
    );
  return parent;
}

function _addLeafItemInRoot(
  gridItems: GridItems,
  newItemId: Id = nanoid()
): GridItems {
  return produce(gridItems, (draft) => {
    draft[newItemId] = {
      parent: "root",
      isLeaf: true,
    };
    draft["root"].children.push(newItemId);
  });
}

function _addLeafItemAtPosition(
  gridItems: GridItems,
  newItemId: Id = nanoid(),
  location: { id: Id; position: Position },
  newStructureId: Id = nanoid()
): GridItems {
  const target = _findLeafItem(gridItems, location.id);
  const parent = _findParentOfLeafItem(gridItems, target);

  const isOnSamePlane =
    ((location.position === "left" || location.position === "right") &&
      parent.orientation === "horizontal") ||
    ((location.position === "top" || location.position === "bottom") &&
      parent.orientation === "vertical");

  const isBefore = location.position === "left" || location.position === "top";

  if (isOnSamePlane) {
    const index = parent.children.indexOf(location.id);
    if (index === -1)
      throw new Error(
        `Item with id ${location.id} is not a child of its parent`
      );

    return produce(gridItems, (draft) => {
      draft[newItemId] = {
        parent: target.parent,
        isLeaf: true,
      };
      (draft[target.parent] as GridParentItem).children.splice(
        index + (isBefore ? 0 : 1),
        0,
        newItemId
      );
    });
  } else {
    return produce(gridItems, (draft) => {
      draft[newItemId] = {
        parent: newStructureId,
        isLeaf: true,
      };
      draft[location.id].parent = newStructureId;
      (draft[target.parent] as GridParentItem).children = parent.children.map(
        (childId) => (childId === location.id ? newStructureId : childId)
      );
      draft[newStructureId] = {
        parent: target.parent,
        isParent: true,
        orientation:
          parent.orientation === "horizontal" ? "vertical" : "horizontal",
        children: isBefore
          ? [newItemId, location.id]
          : [location.id, newItemId],
      };
    });
  }
}

function _removeLeafItem(gridItems: GridItems, id: Id): GridItems {
  return produce(gridItems, (draft) => {
    const target = _findLeafItem(draft, id);

    const parent = _findParentOfLeafItem(draft, target);

    const children = parent.children.filter((childId) => childId !== id);

    delete draft[id];

    if (isGridRootItem(parent)) {
      draft["root"].children = children;
    } else if (children.length > 1) {
      parent.children = children;
    } else {
      if (!isGridStructureItem(parent)) return;
      const grandParent = _findParent(draft, target.parent);
      if (!grandParent)
        throw new Error(`Parent of item with id ${parent.parent} is root`);

      delete draft[target.parent];

      if (children.length === 1) {
        grandParent.children = grandParent.children.map((childId) =>
          childId === target.parent ? children[0] : childId
        );
        _findItem(draft, children[0]).parent = parent.parent;
      } else {
        grandParent.children = grandParent.children.filter(
          (childId) => childId !== parent.parent
        );
      }
    }
  });
}

function _moveLeafItem(
  gridItems: GridItems,
  id: Id,
  location: { id: Id; position: Position },
  newStructureId: Id = nanoid()
): GridItems {
  const removedGridItems = _removeLeafItem(gridItems, id);
  return _addLeafItemAtPosition(removedGridItems, id, location, newStructureId);
}

function _swapLeafItems(gridItems: GridItems, id1: Id, id2: Id): GridItems {
  const item1 = _findLeafItem(gridItems, id1);
  const item2 = _findLeafItem(gridItems, id2);

  const parent1 = _findParentOfLeafItem(gridItems, item1);
  const parent2 = _findParentOfLeafItem(gridItems, item2);

  return produce(gridItems, (draft) => {
    draft[item1.parent] = {
      ...parent1,
      children: parent1.children.map((childId) =>
        childId === id1 ? id2 : childId === id2 ? id1 : childId
      ),
    };
    draft[item2.parent] = {
      ...parent2,
      children: parent2.children.map((childId) =>
        childId === id1 ? id2 : childId === id2 ? id1 : childId
      ),
    };
  });
}

export default function InfiniteGridFunction(gridItems: GridItems) {
  const addLeafItemInRoot = (newItemId: Id = nanoid()) =>
    _addLeafItemInRoot(gridItems, newItemId);

  const addLeafItemAtPosition = (
    newItemId: Id = nanoid(),
    location: { id: Id; position: Position },
    newStructureId: Id = nanoid()
  ) => _addLeafItemAtPosition(gridItems, newItemId, location, newStructureId);

  const removeLeafItem = (id: Id) => _removeLeafItem(gridItems, id);

  const moveLeafItem = (
    id: Id,
    location: { id: Id; position: Position },
    newStructureId: Id = nanoid()
  ) => _moveLeafItem(gridItems, id, location, newStructureId);

  const swapLeafItems = (id1: Id, id2: Id) =>
    _swapLeafItems(gridItems, id1, id2);

  return {
    addLeafItemInRoot,
    addLeafItemAtPosition,
    removeLeafItem,
    moveLeafItem,
    swapLeafItems,
  };
}
