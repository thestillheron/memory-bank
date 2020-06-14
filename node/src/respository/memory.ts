import { query, queryOne } from "./../sqlConnection";
import { upsertPersons } from "./person";
import { upsertTags } from "./tag";
import { NewMemory } from "../../../Shared/src/dtos/newMemory";
import { v4 as uuid } from "uuid";
import { createLinks as createTagLinks } from "./memoryTag";
import { createLinks as createPersonLinks } from "./memoryPerson";
import { MemoryView } from "../../../Shared/src/dtos/memoryView";
import { Memory } from "../../../Shared/src/models/memory";
import { Tag } from "../../../Shared/src/models/tag";
import { Person } from "../../../Shared/src/models/person";
import { MemoryTag } from "../../../Shared/src/models/memoryTag";
import { MemoryPerson } from "../../../Shared/src/models/memoryPerson";

export const saveMemory = async (memory: NewMemory): Promise<MemoryView> => {
  console.log(memory);
  const id = uuid();
  const tags = await upsertTags(memory.tags);
  const persons = await upsertPersons(memory.people);
  await query`INSERT INTO [memory] (
    id,
    title,
    content,
    significance,
    year,
    month,
    day
  ) VALUES (
    ${id},
    ${memory.title},
    ${memory.content},
    ${memory.significance},
    ${memory.year},
    ${memory.month},
    ${memory.day}
  )`;
  await createTagLinks(
    id,
    tags.map((x) => x.id)
  );
  await createPersonLinks(
    id,
    persons.map((x) => x.id)
  );

  return {
    id,
    title: memory.title,
    content: memory.content,
    significance: memory.significance,
    year: memory.year,
    month: memory.month,
    day: memory.day,
    tags,
    people: persons,
  };
};

export const getMemoryView = async (memoryId: string): Promise<MemoryView> => {
  const memory = await queryOne<
    Memory
  >`SELECT * FROM [memory] WHERE id = ${memoryId}`;
  if (!memory) {
    throw new Error("Coudln't find a memory by that ID");
  }
  const tags = await getTagsForMemory(memoryId);
  const people = await getPeopleForMemory(memoryId);

  return {
    ...memory,
    tags,
    people,
  };
};

export const fetchAllMemories = async (): Promise<MemoryView[]> => {
  const memories = await query<Memory>`SELECT * FROM [memory]`;
  const tags = await query<Tag>`SELECT * FROM [tag]`;
  const people = await query<Person>`SELECT * FROM [person]`;
  const tagLinks = await query<MemoryTag>`SELECT * FROM [memoryTag]`;
  const personLinks = await query<MemoryPerson>`SELECT * FROM [memoryPerson]`;

  return memories.map(
    (x) =>
      ({
        ...x,
        people: people.filter((person) =>
          personLinks
            .filter((link) => link.memoryId === x.id)
            .some((link) => link.personId === person.id)
        ),
        tags: tags.filter((tag) =>
          tagLinks
            .filter((link) => link.memoryId === x.id)
            .some((link) => link.tagId === tag.id)
        ),
      } as MemoryView)
  );
};

export const getTagsForMemory = async (id: string) =>
  await query<Tag>`SELECT * FROM [tag] t
  LEFT JOIN memoryTag mt ON mt.tagId = t.id
  WHERE mt.memoryId = ${id}`;

export const getPeopleForMemory = async (id: string) =>
  await query<Tag>`SELECT * FROM [person] p
LEFT JOIN memoryPerson mp ON mp.personId = p.id
WHERE mp.memoryId = ${id}`;
