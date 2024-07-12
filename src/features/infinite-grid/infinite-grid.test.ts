import { expect, test } from "vitest";
import InfiniteGridFunction from "./infinite-grid.function";
import {
  GridRootItem,
  GridItems,
  GridStructureItem,
} from "./infinite-grid.type";
import { produce } from "immer";

test("addLeafItemInRoot", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: [],
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId";

  expect(gridFunction.addLeafItemInRoot(newItemId)).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: "root",
        isLeaf: true,
      };
      draft["root"].children = [newItemId];
    })
  );
});

test("addLeafItemInRoot2", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId2";
  expect(gridFunction.addLeafItemInRoot(newItemId)).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: "root",
        isLeaf: true,
      };
      draft["root"].children.push(newItemId);
    })
  );
});

test("addLeafItemAtLeftPosition", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId2";
  expect(
    gridFunction.addLeafItemAtPosition(newItemId, {
      id: "newItemId1",
      position: "left",
    })
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: "root",
        isLeaf: true,
      };
      draft["root"].children.splice(0, 0, newItemId);
    })
  );
});

test("addLeafItemAtRightPosition", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId2";
  expect(
    gridFunction.addLeafItemAtPosition(newItemId, {
      id: "newItemId1",
      position: "right",
    })
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: "root",
        isLeaf: true,
      };
      draft["root"].children.splice(1, 0, newItemId);
    })
  );
});

test("addLeafItemAtTopPosition", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId2";
  const newStructureId = "newStructureId";
  expect(
    gridFunction.addLeafItemAtPosition(
      newItemId,
      {
        id: "newItemId1",
        position: "top",
      },
      newStructureId
    )
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: newStructureId,
        isLeaf: true,
      };
      draft["newItemId1"] = {
        parent: newStructureId,
        isLeaf: true,
      };
      draft[newStructureId] = {
        parent: "root",
        isParent: true,
        orientation: "vertical",
        children: [newItemId, "newItemId1"],
      };
      draft["root"].children = [newStructureId];
    })
  );
});

test("addLeafItemAtBottomPosition", () => {
  const mockRoot: GridRootItem = {
    parent: null,
    isParent: true,
    orientation: "horizontal",
    children: ["newItemId1"],
  };
  const mockGridItem: GridItems = {
    root: mockRoot,
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  const newItemId = "newItemId2";
  const newStructureId = "newStructureId";
  expect(
    gridFunction.addLeafItemAtPosition(
      newItemId,
      {
        id: "newItemId1",
        position: "bottom",
      },
      newStructureId
    )
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft[newItemId] = {
        parent: newStructureId,
        isLeaf: true,
      };
      draft["newItemId1"] = {
        parent: newStructureId,
        isLeaf: true,
      };
      draft[newStructureId] = {
        parent: "root",
        isParent: true,
        orientation: "vertical",
        children: ["newItemId1", newItemId],
      };
      mockRoot.children = [newStructureId];
    })
  );
});

test("moveLeafItem", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1", "newItemId2"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
    newItemId2: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  expect(
    gridFunction.moveLeafItem("newItemId2", {
      id: "newItemId1",
      position: "right",
    })
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft["root"].children = ["newItemId1", "newItemId2"];
    })
  );
});

test("moveLeafItem2", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["structureId", "newItemId1"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
    newItemId2: {
      parent: "structureId",
      isLeaf: true,
    },
    newItemId3: {
      parent: "structureId",
      isLeaf: true,
    },
    structureId: {
      parent: "root",
      isParent: true,
      orientation: "vertical",
      children: ["newItemId2", "newItemId3"],
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  expect(
    gridFunction.moveLeafItem("newItemId1", {
      id: "newItemId2",
      position: "top",
    })
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft["root"].children = ["structureId"];
      draft["newItemId1"].parent = "structureId";
      (draft["structureId"] as GridStructureItem).children = [
        "newItemId1",
        "newItemId2",
        "newItemId3",
      ];
    })
  );

  expect(
    gridFunction.moveLeafItem("newItemId1", {
      id: "newItemId2",
      position: "bottom",
    })
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft["root"].children = ["structureId"];
      draft["newItemId1"].parent = "structureId";
      (draft["structureId"] as GridStructureItem).children = [
        "newItemId2",
        "newItemId1",
        "newItemId3",
      ];
    })
  );

  const newStructureId = "newStructureId";

  expect(
    gridFunction.moveLeafItem(
      "newItemId1",
      {
        id: "newItemId2",
        position: "left",
      },
      newStructureId
    )
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft["root"].children = ["structureId"];
      draft[newStructureId] = {
        parent: "structureId",
        isParent: true,
        orientation: "horizontal",
        children: ["newItemId1", "newItemId2"],
      };
      draft["newItemId1"].parent = newStructureId;
      draft["newItemId2"].parent = newStructureId;
      (draft["structureId"] as GridStructureItem).children = [
        "newStructureId",
        "newItemId3",
      ];
    })
  );

  expect(
    gridFunction.moveLeafItem(
      "newItemId1",
      {
        id: "newItemId2",
        position: "right",
      },
      newStructureId
    )
  ).toEqual(
    produce(mockGridItem, (draft) => {
      draft["root"].children = ["structureId"];
      draft[newStructureId] = {
        parent: "structureId",
        isParent: true,
        orientation: "horizontal",
        children: ["newItemId2", "newItemId1"],
      };
      draft["newItemId1"].parent = newStructureId;
      draft["newItemId2"].parent = newStructureId;
      (draft["structureId"] as GridStructureItem).children = [
        "newStructureId",
        "newItemId3",
      ];
    })
  );
});

test("removeLeafItem", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["newItemId1", "newItemId2"],
    },
    newItemId1: {
      parent: "root",
      isLeaf: true,
    },
    newItemId2: {
      parent: "root",
      isLeaf: true,
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  expect(gridFunction.removeLeafItem("newItemId1")).toEqual(
    produce(mockGridItem, (draft) => {
      delete draft["newItemId1"];
      draft["root"].children = ["newItemId2"];
    })
  );
});

test("removeLeafItem2", () => {
  const mockGridItem: GridItems = {
    root: {
      parent: null,
      isParent: true,
      orientation: "horizontal",
      children: ["structureId"],
    },
    newItemId1: {
      parent: "structureId",
      isLeaf: true,
    },
    newItemId2: {
      parent: "structureId",
      isLeaf: true,
    },
    structureId: {
      parent: "root",
      isParent: true,
      orientation: "vertical",
      children: ["newItemId1", "newItemId2"],
    },
  };

  const gridFunction = InfiniteGridFunction(mockGridItem);
  expect(gridFunction).toBeDefined();

  expect(gridFunction.removeLeafItem("newItemId1")).toEqual(
    produce(mockGridItem, (draft) => {
      delete draft["newItemId1"];
      delete draft["structureId"];
      draft["newItemId2"].parent = "root";
      draft["root"].children = ["newItemId2"];
    })
  );

  expect(gridFunction.removeLeafItem("newItemId2")).toEqual(
    produce(mockGridItem, (draft) => {
      delete draft["newItemId2"];
      delete draft["structureId"];
      draft["newItemId1"].parent = "root";
      draft["root"].children = ["newItemId1"];
    })
  );
});
