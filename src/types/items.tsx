import { icons } from "../components/IconList";

export type Item = {
    id: string;
    text: string;
    order: number | null;
    folder_id: string | null;  
    icon: keyof typeof icons;
  };

export type Folder = {
    id: string;
    name: string;
    items: Item[];
    order: number | null;
    parent_folder: string | null;
  };

export type ItemXFolder = {
    id: string;
    name: string;
    order: number | null;
    nested_order: number | null;
    folder_id: string | null;
    items: ItemXFolder[];
    icon: keyof typeof icons;
    parent_folder: string | null;
    item_type: 'item' | 'folder';
}



export const dummyData: ItemXFolder[] = [
  {
    id: "1",
    name: "Main Folder",
    order: 1,
    nested_order: null,
    folder_id: null,
    items: [
      {
        id: "1-1",
        name: "Sub Folder 1",
        order: 1,
        nested_order: 1,
        folder_id: "1",
        items: [
          {
            id: "1-1-1",
            name: "Item 1",
            order: 1,
            nested_order: 1,
            folder_id: "1-1",
            items: [],
            icon: "document",
            parent_folder: "1-1",
            item_type: "item",
          },
          {
            id: "1-1-2",
            name: "Item 2",
            order: 2,
            nested_order: 2,
            folder_id: "1-1",
            items: [],
            icon: "image",
            parent_folder: "1-1",
            item_type: "item",
          },
        ],
        icon: "folder",
        parent_folder: "1",
        item_type: "folder",
      },
      {
        id: "1-2",
        name: "Item 3",
        order: 2,
        nested_order: 2,
        folder_id: "1",
        items: [],
        icon: "video",
        parent_folder: "1",
        item_type: "item",
      },
    ],
    icon: "folder",
    parent_folder: null,
    item_type: "folder",
  },
  {
    id: "2",
    name: "Second Folder",
    order: 2,
    nested_order: null,
    folder_id: null,
    items: [
      {
        id: "2-1",
        name: "Item 4",
        order: 1,
        nested_order: 1,
        folder_id: "2",
        items: [],
        icon: "audio",
        parent_folder: "2",
        item_type: "item",
      },
    ],
    icon: "folder",
    parent_folder: null,
    item_type: "folder",
  },
  {
    id: "3",
    name: "Loose Item",
    order: 3,
    nested_order: null,
    folder_id: null,
    items: [],
    icon: "document",
    parent_folder: null,
    item_type: "item",
  },
];