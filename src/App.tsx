import { useEffect, useState } from 'react';
import { ItemInput } from './components/ItemInput';
import { ItemList } from './components/ItemList';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder } from './types/items';
import { FolderInput } from './components/FolderInput';
import { TreeItem } from './components/Tree/types';
const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {
  const [items, setItems] = useState<TreeItem[]>([]);
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
        case 'add_folder':
          setItems((prev) => [...prev, message.folder]);
          break;
        case 'move_item':
          handleMoveItemhelper(message.itemId, message.folderId, message.newOrder);
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
    item.children = [];
    if (ws) {
      ws.send(JSON.stringify({ type: 'add_item', userId, item }));
    }
  };


  const handleAddFolder = (name: string, parentId: string | null = null) => {
    if (ws) {
      const newFolder = {
        id: uuidv4(),
        name,
        children: [],
        parent_folder: parentId,
        item_type: 'folder',
        icon: 'folder',
        order: items.length > 0 ? items[items.length - 1].order + 10 : 10,
      };
      ws.send(
        JSON.stringify({ type: 'add_folder', userId, folder: newFolder })
      );
    }
  };

const handleMoveItemhelper = (
  itemId: string,
  folderId: string | null,
  newOrder: number | null
) => {
  const removeItemFromTree = (
    tree: TreeItem[],
    itemId: string
  ): [TreeItem | null, TreeItem[]] => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.id === itemId) {
        // Remove the node and return it
        const removedItem = { ...node };
        tree.splice(i, 1);
        return [removedItem, tree];
      }
      if (node.children?.length) {
        const [removedItem, updatedChildren] = removeItemFromTree(
          node.children,
          itemId
        );
        if (removedItem) {
          node.children = updatedChildren;
          return [removedItem, tree];
        }
      }
    }
    return [null, tree];
  };

  const findFolderAndAddItem = (
    tree: TreeItem[],
    folderId: string,
    item: TreeItem
  ): TreeItem[] => {
    return tree.map((node) => {
      if (node.id === folderId) {
        // Add the item as a child
        return {
          ...node,
          children: [
            ...(node.children || []),
            { ...item, folder_id: folderId, order: newOrder },
          ],
        };
      }
      if (node.children?.length) {
        return {
          ...node,
          children: findFolderAndAddItem(node.children, folderId, item),
        };
      }
      return node;
    });
  };

  setItems((prevItems) => {
    // Step 1: Remove the item from the tree
    const [removedItem, updatedTree] = removeItemFromTree(
      [...prevItems],
      itemId
    );

    if (!removedItem) {
      console.warn(`Item with id ${itemId} not found`);
      return prevItems;
    }

    // Step 2: If folderId is provided, find the folder and add the item
    if (folderId) {
      return findFolderAndAddItem(updatedTree, folderId, removedItem);
    }

    // Step 3: If no folderId is provided, add the item to the root level with folder_id set to null
    return [
      ...updatedTree,
      { ...removedItem, folder_id: null, order: newOrder }, // Add the item back to the root
    ];
  });
};

  const handleMoveItem = (
    itemId: string,
    folderId: string | null,
    newOrder: number | null
  ) => {

    // Send the WebSocket message
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
        <h1 className="text-2xl font-bold">Adaline Technical Challenge</h1>
        <ItemInput onAddItem={handleAddItem} />
        <FolderInput onAddFolder={handleAddFolder} />
        <ItemList
          items={items}
          onMoveItem={handleMoveItem}
        />
      </div>
    </div>
  );
}

export default App;
