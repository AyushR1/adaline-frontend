import type { MutableRefObject } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { icons } from '../IconList';

export interface TreeItem {
  id: UniqueIdentifier;
  name?: string;
  order?: number | null;
  folder_id?: string | null;
  icon?: keyof typeof icons;
  collapsed?: boolean;
  item_type?: 'folder' | 'item';
  children: TreeItem[];
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null | string | undefined | number;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
