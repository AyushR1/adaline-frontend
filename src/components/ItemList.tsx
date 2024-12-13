import { Button } from '@/components/ui/button';
import { icons } from '../components/IconList';
import { Item } from '../types/items';
import { DragDropContext, Droppable, Draggable,DroppableProps } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};
export const ItemList: React.FC<{
  items: Item[];
  onDeleteItem: (item: Item) => void;
  onMoveItem: (itemId: string, folderId: string | null, newOrder: number | null) => void;
}> = ({ items, onDeleteItem, onMoveItem }) => {

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return; // Dropped outside the list

    if (source.index === destination.index) return; // No movement
    var newOrder ;
    if (source.index < destination.index) {
      newOrder = items[destination.index].order + 1;
    }
    if (source.index > destination.index) {
      newOrder = items[destination.index].order - 1;
    }
    onMoveItem(items[source.index].id, null, newOrder);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="item-list">
        {(provided) => (
          <div
            ref={provided.innerRef}  // Ensure this ref is attached
            {...provided.droppableProps}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}  // Ensure draggable ref is attached
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex justify-between items-center border-b pb-2 cursor-move"
                  >
                    <div className="flex items-center space-x-2">
                      {icons[item.icon]} <span>{item.text} (Order: {item.order})</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onDeleteItem(item)}>
                      Delete
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}  // Necessary to maintain space during dragging
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
