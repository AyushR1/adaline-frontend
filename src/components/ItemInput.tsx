import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { icons } from '@/components/IconList';
import { Item } from '../types/items';
import { v4 as uuidv4 } from 'uuid';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';



export const ItemInput: React.FC<{ onAddItem: (item: Item) => void }> = ({
  onAddItem,
}) => {
  const [text, setText] = useState('');
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof icons>('check');

  const handleAddItem = () => {
    if (text.trim()) {
      onAddItem({ text, icon: selectedIcon, id: uuidv4(), order: 0, folder_id: null });
      setText('');
    }
  };


  const filteredIcons = Object.keys(icons).filter((iconKey) =>
    iconKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex space-x-4">
      <Input
        type="text"
        placeholder="Enter an item"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {selectedIcon ? icons[selectedIcon] : 'Select Icon'} Select Icon
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {' '}
          {/* Adjust width as needed */}
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredIcons.length > 0 ? (
            filteredIcons.map((iconKey) => (
              <DropdownMenuItem
                key={iconKey}
                onSelect={() => setSelectedIcon(iconKey as keyof typeof icons)}
              >
                {icons[iconKey as keyof typeof icons]} {iconKey}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No icons found</div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={handleAddItem}>Add Item</Button>
    </div>
  );
};
