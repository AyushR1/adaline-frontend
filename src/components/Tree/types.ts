import type {MutableRefObject} from 'react';
import type {UniqueIdentifier} from '@dnd-kit/core';
import { icons } from "../IconList";

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
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Main Folder",
    order: 1,
    folder_id: null,
    icon: "folder",
    collapsed: false,
    item_type: 'folder',
    children: [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Sub Folder 1",
        order: 1,
        folder_id: "550e8400-e29b-41d4-a716-446655440000",
        icon: "folder",
        collapsed: false,
        item_type: 'folder',
        children: [
          {
            id: "550e8400-e29b-41d4-a716-446655440002",
            name: "Item 1",
            order: 1,
            folder_id: "550e8400-e29b-41d4-a716-446655440001",
            icon: "document",
            collapsed: false,
            item_type: 'item',
            children: [],
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440003",
            name: "Item 2",
            order: 2,
            folder_id: "550e8400-e29b-41d4-a716-446655440001",
            icon: "trash",
            collapsed: false,
            item_type: 'item',
            children: [],
          },
        ],
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        name: "Item 3",
        order: 2,
        folder_id: "550e8400-e29b-41d4-a716-446655440000",
        icon: "archivebox",
        collapsed: false,
        item_type: 'item',
        children: [],
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Second Folder",
    order: 2,
    folder_id: null,
    icon: "folder",
    collapsed: false,
    item_type: 'folder',
    children: [
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Item 4",
        order: 1,
        folder_id: "550e8400-e29b-41d4-a716-446655440005",
        icon: "arrowdownright",
        collapsed: false,
        item_type: 'item',
        children: [],
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Loose Item",
    order: 3,
    folder_id: null,
    icon: "document",
    collapsed: false,
    item_type: 'item',
    children: [],
  },
];
