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
    parent_folder: string | null;
  };
  