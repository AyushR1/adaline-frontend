import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const FolderInput: React.FC<{ onAddFolder: (name: string) => void }> = ({ onAddFolder }) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onAddFolder(folderName);
      setFolderName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
      <Input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Folder name"
        className="w-full"
      />

      <Button className='w-40' type="submit">Add Folder</Button>
    </form>
  );
};
