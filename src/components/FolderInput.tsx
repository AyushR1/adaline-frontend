import React, { useState } from 'react';

export const FolderInput = ({ onAddFolder }: { onAddFolder: (name: string) => void }) => {
    const [folderName, setFolderName] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (folderName.trim()) {
        onAddFolder(folderName);
        setFolderName('');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Folder name"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Folder
        </button>
      </form>
    );
  };