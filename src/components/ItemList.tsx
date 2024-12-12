import { Button } from "@/components/ui/button";

type ItemListProps = {
  items: string[];
  onDeleteItem: (item: string) => void;
};

export const ItemList: React.FC<ItemListProps> = ({ items, onDeleteItem }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b pb-2"
        >
          <span>{item}</span>
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
