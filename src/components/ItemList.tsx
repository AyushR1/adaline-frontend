import { Button } from '@/components/ui/button';
import { icons } from '@/components/IconList';
type Item = {
  text: string;
  icon: keyof typeof icons;
};

export const ItemList: React.FC<{
  items: Item[];
  onDeleteItem: (item: Item) => void;
}> = ({ items, onDeleteItem }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
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
    </div>
  );
};
