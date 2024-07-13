import InfiniteGridProvider from "./infinite-grid.component.provider";

import "./infinite-grid.sample.css";
import InfiniteGridSampleItem from "./infinite-grid.sample.item";

export default function InfiniteGridSample() {
  return (
    <div className="infinite-grid-sample">
      <InfiniteGridProvider
        initialGridItems={{
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
        }}
      >
        <InfiniteGridSampleItem id="root" />
      </InfiniteGridProvider>
    </div>
  );
}
