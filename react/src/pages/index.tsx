import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

import Layout from '../components/layout';
import { Memory, NewPerson, NewTag } from '../model';
import PeopleList from '../components/peopleList';
import FreeTextList from '../components/freeTextList';

const IndexPage = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [title, setTitle] = useState<string | undefined>();
  const [content, setContent] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [month, setMonth] = useState<string | undefined>();
  const [day, setDay] = useState<string | undefined>();
  const [people, setPeople] = useState<NewPerson[]>([]);
  const [peopleStrings, setPeopleStrings] = useState<string[]>([]);
  const [tags, setTags] = useState<NewTag[]>([]);
  const [tagStrings, setTagStrings] = useState<string[]>([]);

  const submit = () => {};

  return (
    <Layout>
      <form autoComplete="off">
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title (Ctrl+T)"
          required
        />
        <TextField
          value={content}
          onChange={(e) => setContent(e.target.value)}
          label="Content (Ctrl+C)"
          multiline
        />
        <TextField
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Year (Ctrl+Y)"
        />
        <TextField
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          label="Month (Ctrl+M)"
        />
        <TextField
          value={day}
          onChange={(e) => setDay(e.target.value)}
          label="Day (Ctrl+D)"
        />
        <FreeTextList
          items={peopleStrings}
          onChange={(items) => setPeopleStrings(items)}
          placeholder="People (Ctrl+P)"
        />
        <FreeTextList
          items={tagStrings}
          onChange={(items) => setTagStrings(items)}
          placeholder="Tags (Ctrl+T)"
        />
        <Button onClick={() => submit()} />
      </form>
      {memories.map((memory) => (
        <div>
          <p>{`${memory.title} | ${memory.content} | ${memory.year} | ${memory.month} | ${memory.day}`}</p>
        </div>
      ))}
    </Layout>
  );
};

export default IndexPage;
