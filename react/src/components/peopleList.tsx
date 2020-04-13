import React from 'react';
import { NewPerson } from '../model';
import FreeTextList from './freeTextList';

export interface PeopleListProps {
  people: NewPerson[];
  update: (items: NewPerson[]) => void;
}

const PeopleList: React.FC<PeopleListProps> = ({ people, update }) => {
  return (
    <FreeTextList
      items={people.map((x) => x.name as string)}
      update={(list) => update(list.map((x) => ({ id: '', name: x })))}
      suggest={(x) => Promise.resolve('')}
    />
  );
};

export default PeopleList;
