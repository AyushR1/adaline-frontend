import { Button } from '@/components/ui/button';
import { icons } from '../components/IconList';
import { Item, ItemXFolder } from '../types/items';
import { FolderIcon } from '@heroicons/react/24/outline';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProps,
} from 'react-beautiful-dnd';
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
  items: ItemXFolder[];
  onDeleteItem: (item: Item) => void;
  onMoveItem: (
    itemId: string,
    folderId: string | null,
    newOrder: number | null
  ) => void;
}> = ({ items, onDeleteItem, onMoveItem }) => {
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return; // Dropped outside the list

    if (source.index === destination.index) return; // No movement
    var newOrder;

    if (items[source.index].item_type === 'item' && items[destination.index].item_type === 'folder') {
      onMoveItem(items[source.index].id, items[destination.index].id, null);}

    if (source.index < destination.index) {
      if (destination.index === items.length - 1) {
        newOrder = items[destination.index].order + 10;
      } else {
        newOrder =
          (items[destination.index].order +
            items[destination.index + 1].order) /
          2;
      }
      // newOrder = items[destination.index].
    }
    if (source.index > destination.index) {
      if (destination.index === 0) {
        newOrder = items[destination.index].order / 2;
      } else {
        newOrder =
          (items[destination.index].order +
            items[destination.index - 1].order) /
          2;
      }
      // newOrder = items[destination.index].order - 1;
    }
    onMoveItem(items[source.index].id, null, newOrder);
  };
  console.log('items', items);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="item-list">
        {(provided) => (
          <div
            ref={provided.innerRef} // Ensure this ref is attached
            {...provided.droppableProps}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => {
                  if (item.item_type === 'item') {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center border-b pb-2 cursor-move"
                      >
                        <div className="flex items-center space-x-2">
                          {icons[item.icon]}{' '}
                          <span>
                            {item.text} (Order: {item.order})
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteItem(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    );
                  } else if (item.item_type === 'folder') {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center bg-gray-200 p-2 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <FolderIcon className="w-5 h-5" />
                          <span>{item.name} Order: {item.order}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              </Draggable>
            ))}
            {provided.placeholder} // Necessary to maintain space during
            dragging
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
