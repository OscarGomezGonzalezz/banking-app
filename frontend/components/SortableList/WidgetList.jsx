import React from 'react';
import { View } from 'react-native';

import { MARGIN } from './Config';
import Tile from './Tile';
import SortableList from './SortableList';

const tiles = [
  { id: 'spent' },
  { id: 'categories' },
  { id: 'accounts' },
  { id: 'cashback' },
];

const WidgetList = ({spent, expensesByAccount, expensesByCategory}) => {
  return (
    <View style={{flex: 1}}>
    
      <SortableList
        editing={true}
        onDragEnd={(positions) => console.log(JSON.stringify(positions, null, 2))}
      >
        {tiles.map((tile, index) => (
          <Tile
            key={`${tile.id}-${index}`}
            id={tile.id}
            onLongPress={() => true}
            spent={spent}
            expensesByAccount={expensesByAccount}
            expensesByCategory={expensesByCategory}
          />
        ))}
      </SortableList>
    </View>
  );
};

export default WidgetList;
