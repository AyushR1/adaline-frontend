import { useEffect, useState } from "react";
import { ItemInput } from "./components/ItemInput";
import { ItemList } from "./components/ItemList";
import { v4 as uuidv4 } from "uuid";

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;


function App() {
  const [items, setItems] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Function to get userId from query params or generate a new one
  const getUserId = () => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("userId");
    if (!id) {
      id = uuidv4(); // Generate a new UUID if userId doesn't exist
      const newUrl = `${window.location.origin}${window.location.pathname}?userId=${id}`;
      window.history.replaceState({}, document.title, newUrl); // Update URL with new userId
    }
    return id;
  };

  useEffect(() => {
    const id = getUserId();
    setUserId(id);

    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      websocket.send(JSON.stringify({ type: "join", userId: id }));
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
        default:
          console.error("Unknown message type", message);
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
      ws.send(JSON.stringify({ type: "add_item", userId, item }));
    }
  };

  const handleDeleteItem = (item: string) => {
    if (ws) {
      ws.send(JSON.stringify({ type: "delete_item", userId, item }));
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