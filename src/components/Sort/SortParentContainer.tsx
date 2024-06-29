import { FC, ReactNode } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export type Props = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  onChange: (id: string[]) => void;
  children: ReactNode;
};

const SortParentContainer: FC<Props> = ({ id, items, onChange, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { setNodeRef } = useDroppable({ id });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(e: DragEndEvent) =>
        onChange(
          e.collisions ? (e.collisions.map(({ id }) => id) as string[]) : []
        )
      }
    >
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>{children}</div>
      </SortableContext>
    </DndContext>
  );
};

export default SortParentContainer;
