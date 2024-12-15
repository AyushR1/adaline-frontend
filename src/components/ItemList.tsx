
import {SortableTree} from './tree/SortableTree';
import { TreeItems } from './tree/types';

const Wrapper = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      maxWidth: 600,
      padding: 10,
      margin: '0 auto',
      marginTop: '10%',
    }}
  >
    {children}
  </div>
);

export const ItemList: React.FC<{
  items:TreeItems,
  onEditItem: (itemId: string, collapsed:boolean) => void;
  onMoveItem: (
    itemId: string,
    folderId: string | null,
    newOrder: number | null,
  ) => void;
  
}> = ({ items,onEditItem, onMoveItem }) => {
  return (
    <Wrapper>
    <SortableTree collapsible defaultItems={items} onEditItem={onEditItem} onMoveItem={onMoveItem}  />
  </Wrapper>
  );
};
