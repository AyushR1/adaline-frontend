import { useEffect, useState } from 'react';
import { ItemInput } from './components/ItemInput';
import { ItemList } from './components/ItemList';
import { v4 as uuidv4 } from 'uuid';
import { Item } from './types/items';
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {
  const [items, setItems] = useState<Item[]>([]);
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
      switch (message.type) {
        case 'item_added':
          setItems((prev) => [...prev, message.item]);
          break;
        case 'item_deleted':
          setItems((prev) =>
            prev.filter((item) => item.text !== message.item.text)
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

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Real-Time Todo App with Icons</h1>
        <ItemInput onAddItem={handleAddItem} />
        <ItemList items={items} onDeleteItem={handleDeleteItem} />
      </div>
    </div>
  );
}

export default App;
