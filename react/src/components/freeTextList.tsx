import React, { useState } from 'react';
import { TAB, ENTER } from '../keyCodes';
import { arrayOf } from 'prop-types';

export interface FreeTextListProps {
  items: string[];
  update: (items: string[]) => void;
  suggest: (text: string) => Promise<string | undefined>;
}

const FreeTextList: React.FC<FreeTextListProps> = ({ items, update }) => {
  const [currentItem, setCurrentItem] = useState<string | undefined>();
  const handleShortcuts = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === TAB) {
      // select the suggestion
    } else if (event.keyCode === ENTER) {
      if (currentItem) update([...items, currentItem]);
      setCurrentItem(undefined);
    }
  };

  return (
    <div>
      <>
        {items.map((item) => (
          <div>{item}</div>
        ))}
      </>
      <input
        type="text"
        value={currentItem}
        onChange={(e) => setCurrentItem(e.target.value)}
        onKeyDown={(e) => handleShortcuts(e)}
      />
    </div>
  );
};

export default FreeTextList;
