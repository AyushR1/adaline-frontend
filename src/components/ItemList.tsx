
import {SortableTree} from './Tree/SortableTree';
import { TreeItem } from './Tree/types';

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
  items:TreeItem[],
  onMoveItem: (
    itemId: string,
    folderId: string | null,
    newOrder: number | null,
    nested_order: number | null
  ) => void;
}> = ({ items, onMoveItem }) => {
  return (
    <Wrapper>
    <SortableTree collapsible defaultItems={items} onMoveItem={onMoveItem} />
  </Wrapper>
  );
};
