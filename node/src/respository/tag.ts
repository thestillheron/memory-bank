import { query, bulk } from "./../sqlConnection";
import { NewMemoryTag } from "../../../Shared/src/dtos/newMemory";
import { Tag } from "../../../Shared/src/models/tag";
import * as sql from "mssql";
import { v4 as uuid } from "uuid";

export const upsertTags = async (tags: NewMemoryTag[]): Promise<Tag[]> => {
  const insertableTags = tags.filter((x) => !x.id);
  const names = insertableTags.map((x) => x.id);
  const existingTags = await query<Tag>`SELECT * FROM [tag]
    WHERE name IN (${names.join(", ")})
  `;
  const newTags = insertableTags.filter(
    (x) => !existingTags.map((existingTag) => existingTag.name).includes(x.name)
  );
  const newInsertableTags = newTags.map((x) => ({
    id: uuid(),
    name: x.name,
  }));

  const table = new sql.Table("tag");
  table.columns.add("id", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  table.columns.add("name", sql.VarChar, {
    nullable: false,
  });
  newInsertableTags.forEach((x) => {
    table.rows.add(x.id, x.name);
  });

  await bulk(table);

  const resultingTags = tags
    .filter((x) => x.id)
    .map((x) => x as Tag)
    .concat(existingTags)
    .concat(newInsertableTags);

  return resultingTags;
};
