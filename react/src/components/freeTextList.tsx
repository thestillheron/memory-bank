import React, { useState } from 'react';
import { TAB, ENTER } from '../keyCodes';

export interface FreeTextListProps {
  items: string[];
  onChange: (items: string[]) => void;
  // suggest: (text: string) => Promise<string | undefined>;
  placeholder?: string;
}

const FreeTextList: React.FC<FreeTextListProps> = ({
  items,
  onChange,
  placeholder,
}) => {
  const [currentItem, setCurrentItem] = useState<string | undefined>();
  const handleShortcuts = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === TAB) {
      // select the suggestion
    } else if (event.keyCode === ENTER) {
      if (currentItem) onChange([...items, currentItem]);
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
        placeholder={placeholder}
      />
    </div>
  );
};

export default FreeTextList;
