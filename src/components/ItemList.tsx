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
function computeNewOrder(sourceIndex, destinationIndex, items) {
  let newOrder;

  if (sourceIndex < destinationIndex) {
    if (destinationIndex === items.length - 1) {
      // Destination is the last item
      newOrder = items[destinationIndex].order + 10;
    } else {
      // Destination is in the middle
      newOrder =
        (items[destinationIndex].order + items[destinationIndex + 1].order) / 2;
    }
  } else if (sourceIndex > destinationIndex) {
    if (destinationIndex === 0) {
      // Destination is the first item
      newOrder = items[destinationIndex].order / 2;
    } else {
      // Destination is in the middle
      newOrder =
        (items[destinationIndex].order + items[destinationIndex - 1].order) / 2;
    }
  }

  return newOrder;
}
export const ItemList: React.FC<{
  items: ItemXFolder[];
  onDeleteItem: (item: Item) => void;
  onMoveItem: (
    itemId: string,
    folderId: string | null,
    newOrder: number | null,
    nested_order: number | null
  ) => void;
}> = ({ items, onDeleteItem, onMoveItem }) => {
  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return; // Dropped outside the list

    if (source.index === destination.index) return; // No movement


    if (
      items[source.index].item_type === 'item' &&
      (items[destination.index].item_type === 'folder' || items[destination.index].folder_id != null)
    ) {
      const newOrder = computeNewOrder(source.index, destination.index, items);
      // nestedorder = 
      onMoveItem(items[source.index].id, items[destination.index].id, newOrder);
    }
    const newOrder = computeNewOrder(source.index, destination.index, items);
    onMoveItem(items[source.index].id, null, newOrder);

    // if (items[source.index].item_type == 'folder') {
    //   onMoveItem(items[source.index].id, null, newOrder);
    // } else if (
    //   items[source.index].item_type == 'item' &&
    //   items[destination.index].item_type == 'folder'
    // ) {
    //   let nested_order = 0;
    //   onMoveItem(
    //     items[source.index].id,
    //     items[destination.index].folder_id,
    //     items[destination.index].order.nested_order
    //   );
    // }
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
                          <span>
                            {item.name} Order: {item.order}
                          </span>
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
