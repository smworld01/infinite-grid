import { useInfiniteGridSelector } from "./infinite-grid.hook.selector";
import { Id, isGridLeafItem, isGridParentItem } from "./infinite-grid.type";

import "./infinite-grid.sample.item.css";

export default function InfiniteGridSampleItem(props: { id: Id }) {
  const { id } = props;
  const item = useInfiniteGridSelector((state) => state.gridItems[id]);

  console.log("Rendering item", id);

  if (isGridParentItem(item)) {
    return (
      <div className={`grid-item-structure ${item.orientation}`}>
        {item.children.map((childId) => (
          <InfiniteGridSampleItem key={childId} id={childId} />
        ))}
      </div>
    );
  } else if (isGridLeafItem(item)) {
    return (
      <div className="grid-item-leaf">
        {props.id}
        <InfiniteGridSampleItemButtons id={props.id} />
      </div>
    );
  }
}

function InfiniteGridSampleItemButtons(props: { id: Id }) {
  const { id } = props;
  const addNewItem = useInfiniteGridSelector(
    (state) => state.addLeafItemAtPosition
  );
  const remove = useInfiniteGridSelector((state) => state.removeLeafItem);
  return (
    <>
      <button
        className="top-button"
        onClick={() => {
          addNewItem(undefined, {
            id,
            position: "top",
          });
        }}
      >
        ⬆
      </button>
      <button
        className="bottom-button"
        onClick={() => {
          addNewItem(undefined, {
            id,
            position: "bottom",
          });
        }}
      >
        ⬇
      </button>
      <button
        className="left-button"
        onClick={() => {
          addNewItem(undefined, {
            id,
            position: "left",
          });
        }}
      >
        ⬅
      </button>
      <button
        className="right-button"
        onClick={() => {
          addNewItem(undefined, {
            id,
            position: "right",
          });
        }}
      >
        ⮕
      </button>
      <button
        className="remove-button"
        onClick={() => {
          remove(id);
        }}
      >
        ❌
      </button>
    </>
  );
}
