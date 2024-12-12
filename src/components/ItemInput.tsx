import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ItemInputProps = {
  onAddItem: (item: string) => void;
};

export const ItemInput: React.FC<ItemInputProps> = ({ onAddItem }) => {
  const [item, setItem] = useState("");

  const handleAddItem = () => {
    if (item.trim()) {
      onAddItem(item);
      setItem("");
    }
  };

  return (
    <div className="flex space-x-4">
      <Input
        type="text"
        placeholder="Enter a item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <Button onClick={handleAddItem}>Add Item</Button>
    </div>
  );
};
