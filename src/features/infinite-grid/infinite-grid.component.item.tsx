import { useInfiniteGridSelector } from "./infinite-grid.hook.selector";
import { Id, isGridLeafItem, isGridParentItem } from "./infinite-grid.type";

import "./infinite-grid.component.item.css";

export default function InfiniteGridItem(props: { id: Id }) {
  const { id } = props;
  const item = useInfiniteGridSelector((state) => state.gridItems[id]);

  if (isGridParentItem(item)) {
    return (
      <div className={`grid-item-structure ${item.orientation}`}>
        {item.children.map((childId) => (
          <InfiniteGridItem key={childId} id={childId} />
        ))}
      </div>
    );
  } else if (isGridLeafItem(item)) {
    return <slot className="grid-item-leaf" name={props.id} />;
  }
}
