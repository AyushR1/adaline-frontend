import { icons } from "../components/IconList";

export type Item = {
    id: string;
    name: string;
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
    folder_id: string | null;
    items: ItemXFolder[];
    icon: keyof typeof icons;
    parent_folder: string | null;
    item_type: 'item' | 'folder';
}
