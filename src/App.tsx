import { useEffect, useState } from 'react';
import { ItemInput } from './components/ItemInput';
import { ItemList } from './components/ItemList';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder, ItemXFolder } from './types/items';
import { FolderInput } from './components/FolderInput';
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {
  const [items, setItems] = useState<ItemXFolder[]>([]);
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
          setItems((prev) => [...prev, message.item]);
          break;

        case 'delete_item':
          setItems((prev) =>
            prev.filter((item) => item.id !== message.item.id)
          );
          break;
        case 'add_folder':
          setItems((prev) => [...prev, message.folder]);
          break;
        case 'delete_folder':
          setFolders((prev) =>
            prev.filter((folder) => folder.id !== message.folderId)
          );
          break;

        case 'move_item':
          setItems((prev) => {
            const updatedItems = prev.map((item) =>
              item.id === message.itemId
                ? { ...item, folder_id: message.folderId }
                : item
            );
            return updatedItems.sort((a, b) => a.order - b.order);
          });
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
    item.order = items.length > 0 ? items[items.length - 1].order + 10 : 10;
    item.item_type = 'item';
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
        item_type: 'folder',
        order:  items.length > 0 ? items[items.length - 1].order + 10 : 10
      };
      ws.send(
        JSON.stringify({ type: 'add_folder', userId, folder: newFolder })
      );
    }
  };
  const handleMoveItem = (
    itemId: string,
    folderId: string | null,
    newOrder: number | null
  ) => {
    console.log('move item', itemId, folderId, newOrder);
    items.forEach((item) => {
      if (item.id === itemId) {
        item.order = newOrder;
        item.folder_id = folderId;
      }
    });
    if (ws) {
      ws.send(
        JSON.stringify({
          type: 'move_item',
          userId,
          itemId,
          folderId,
          newOrder,
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
        <ItemList
          items={items}
          onDeleteItem={handleDeleteItem}
          onMoveItem={handleMoveItem}
        />
      </div>
    </div>
  );
}

export default App;
