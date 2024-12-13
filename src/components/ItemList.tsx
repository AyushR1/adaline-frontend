import { Button } from '@/components/ui/button';
import { icons } from '@/components/IconList';
import { Item, Folder } from '../types/items';

export const ItemList: React.FC<{
  items: Item[];
  folders: Folder[];
  onDeleteItem: (item: Item) => void;
  onMoveItem: (itemId: string, folderId: string | null) => void;
}> = ({ items, folders, onDeleteItem, onMoveItem }) => {
  return (
    <div className="space-y-4">
      {/* Items Outside Folders */}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div className="flex items-center space-x-2">
            {icons[item.icon]} <span>{item.text}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteItem(item)}
          >
            Delete
          </Button>
        </div>
      ))}

      {/* Folders */}
      {folders.map((folder) => (
        <div key={folder.id} className="ml-4 p-2 border rounded">
          <span className="font-bold">{folder.name}</span>
          <ItemList
            items={folder.items}
            folders={[]}
            onDeleteItem={onDeleteItem}
            onMoveItem={(itemId, folderId) => onMoveItem(itemId, folder.id)}
          />
        </div>
      ))}
    </div>
  );
};
