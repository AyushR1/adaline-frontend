import type { MutableRefObject } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { icons } from '../IconList';

export interface TreeItem {
  id: UniqueIdentifier;
  name: string;
  order: number | null;
  folder_id: string | null;
  icon: keyof typeof icons;
  collapsed?: boolean;
  item_type: 'folder' | 'item';
  children: TreeItem[];
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;

export const dummyData: TreeItem[] = [
  {
    id: 'b9988dbd-5d6c-4ea5-a12a-1e01d298bb35',
    name: 'Main Folder',
    order: 10,
    collapsed: false,
    item_type: 'folder',
    children: [
      {
        id: 'b58ec8c4-5f8f-436f-a1e9-7edf68b4953b',
        name: 'sub folder',
        order: 15,
        collapsed: false,
        item_type: 'folder',
        children: [
          {
            id: 'e281389a-b947-406e-9a87-36775305e93d',
            name: 'Item 1',
            order: 20,
            folder_id: 'b58ec8c4-5f8f-436f-a1e9-7edf68b4953b',
            icon: 'check',
            userId: '1863a414-0afa-40e6-91c2-a1412bdac7e5',
            createdAt: '2024-12-14T17:40:52.301Z',
            updatedAt: '2024-12-14T17:42:11.853Z',
            item_type: 'item',
            children: [],
          },
          {
            id: '438989b6-f2ad-464a-a7e9-87b91faf4c5b',
            name: 'Item 2',
            order: 30,
            folder_id: 'b58ec8c4-5f8f-436f-a1e9-7edf68b4953b',
            icon: 'check',
            userId: '1863a414-0afa-40e6-91c2-a1412bdac7e5',
            createdAt: '2024-12-14T17:41:02.466Z',
            updatedAt: '2024-12-14T17:42:17.182Z',
            item_type: 'item',
            children: [],
          },
        ],
      },
    ],
  },
];
