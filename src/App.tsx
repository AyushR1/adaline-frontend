import { useEffect, useState } from "react";
import { ItemInput } from "./components/ItemInput";
import { ItemList } from "./components/ItemList";

const WS_URL = import.meta.env.WEBSOCKET_URL;

function App() {
  const [items, setItems] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Establish WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      websocket.send(JSON.stringify({ type: "join", userId: "user123" }));
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "item_added":
          setItems((prev) => [...prev, message.item]);
          break;
        case "item_deleted":
          setItems((prev) => prev.filter((item) => item !== message.item));
          break;
      }
    };

    websocket.onclose = () => console.log("WebSocket closed");

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleAddItem = (item: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: "add_item", userId: "user123", item }));
    }
  };

  const handleDeleteItem = (item: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: "delete_item", userId: "user123", item }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Real-Time Todo App</h1>
      <ItemInput onAddItem={handleAddItem} />
      <ItemList items={items} onDeleteItem={handleDeleteItem} />
    </div>
  );
}

export default App;
