import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  makeStyles,
} from '@material-ui/core';

import Layout from '../components/layout';
import { Memory, NewPerson, NewTag } from '../model';
import FreeTextList from '../components/freeTextList';
import { saveMemory } from '../commands/memory';
import {
  Significance,
  LOW,
  SIGNIFICANCE_LIST,
} from '../../../Shared/src/constants/significance';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: '8rem',
  },
}));

const IndexPage = () => {
  const classes = useStyles();
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
  const [significance, setSignificance] = useState<Significance | undefined>();

  const submit = () => {
    saveMemory({
      title,
      content,
      year,
      month,
      day,
    });
  };

  let significanceOptions: JSX.Element[] = [];

  for (const significanceOption of SIGNIFICANCE_LIST) {
    significanceOptions.push(
      <MenuItem value={significanceOption}>{significanceOption}</MenuItem>
    );
  }

  return (
    <Layout>
      <form autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label="Content"
              variant="outlined"
              multiline
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id="significance-label">Significance</InputLabel>
              <Select
                required
                labelId="significance-label"
                value={significance}
                onChange={(e) =>
                  setSignificance(e.target.value as Significance)
                }
              >
                {significanceOptions}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label="Year"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              label="Month"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={day}
              onChange={(e) => setDay(e.target.value)}
              label="Day"
            />
          </Grid>
          <Grid item xs={6}>
            <FreeTextList
              items={peopleStrings}
              onChange={(items) => setPeopleStrings(items)}
              placeholder="People"
            />
          </Grid>
          <Grid item xs={6}>
            <FreeTextList
              items={tagStrings}
              onChange={(items) => setTagStrings(items)}
              placeholder="Tags"
            />
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => submit()}>Submit</Button>
          </Grid>
        </Grid>
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
