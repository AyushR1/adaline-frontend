import { useEffect, useState } from 'react';
import { ItemInput } from './components/ItemInput';
import { ItemList } from './components/ItemList';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder } from './types/items';
import { FolderInput } from './components/FolderInput';
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;


function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string>('');

  const getUserId = () => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get('userId');
    if (!id) {
      id = uuidv4();
      const newUrl = `${window.location.origin}${window.location.pathname}?userId=${id}`;
      window.history.replaceState({}, document.title, newUrl);
    }
    return id;
  };

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    const websocket = new WebSocket(WS_URL);
    websocket.onopen = () => {
      console.log('Connected to WebSocket');
      websocket.send(JSON.stringify({ type: 'join', userId: id }));
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message', message);
      switch (message.type) {
        case 'add_item':
          console.log('item added', message);
          setItems((prev) => [...prev, message.item]);
          break;

        case 'delete_item':
          setItems((prev) =>
            prev.filter((item) => item.id !== message.item.id)
          );
          break;
        case 'add_folder':
          setFolders((prev) => [...prev, message.folder]);
          break;

        case 'delete_folder':
          setFolders((prev) =>
            prev.filter((folder) => folder.id !== message.folderId)
          );
          break;
        case 'move_item':
          setFolders((prev) =>
            prev.map((folder) =>
              folder.id === message.folderId
                ? { ...folder, items: [...folder.items, message.item] }
                : folder
            )
          );
          break;
        case 'move_folder':
          setFolders((prev) =>
            prev.map((folder) =>
              folder.id === message.folderId
                ? { ...folder, parent_folder: message.parentFolderId }
                : folder
            )
          );
          break;
        default:
          console.error('Unknown message type', message);
      }
    };

    websocket.onclose = () => console.log('WebSocket closed');
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleAddItem = (item: Item) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'add_item', userId, item }));
    }
  };

  const handleDeleteItem = (item: Item) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'delete_item', userId, item }));
    }
  };

  const handleAddFolder = (name: string, parentId: string | null = null) => {
    if (ws) {
      const newFolder = {
        id: uuidv4(),
        name,
        items: [],
        parent_folder: parentId,
      };
      ws.send(
        JSON.stringify({ type: 'add_folder', userId, folder: newFolder })
      );
    }
  };
  const handleMoveItem = (itemId: string, folderId: string | null) => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "move_item",
          userId,
          itemId,
          folderId,
        })
      );
    }
  };
  
  const handleAddItemToFolder = (folderId: string, text: string) => {
    if (ws) {
      const newItem = { id: uuidv4(), text };
      ws.send(
        JSON.stringify({ type: '', userId, folderId, item: newItem })
      );
    }
  };

  const handleDeleteItemFromFolder = (folderId: string, itemId: string) => {
    if (ws) {
      ws.send(
        JSON.stringify({
          type: 'item_deleted_from_folder',
          userId,
          folderId,
          itemId,
        })
      );
    }
  };
  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Real-Time Todo App with Icons</h1>
        <ItemInput onAddItem={handleAddItem} />
        <FolderInput onAddFolder={handleAddFolder} />
        <ItemList items={items} folders={folders} onDeleteItem={handleDeleteItem} onMoveItem={handleMoveItem} />
      </div>
    </div>
  );
}

export default App;
