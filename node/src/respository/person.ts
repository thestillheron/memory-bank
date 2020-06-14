import { query, bulk } from "./../sqlConnection";
import { NewMemoryPerson } from "../../../Shared/src/dtos/newMemory";
import { Person } from "../../../Shared/src/models/person";
import * as sql from "mssql";
import { v4 as uuid } from "uuid";

export const upsertPersons = async (
  persons: NewMemoryPerson[]
): Promise<Person[]> => {
  const insertablePersons = persons.filter((x) => !x.id);
  const names = insertablePersons.map((x) => x.id);
  const existingPersons = await query<Person>`SELECT * FROM [person]
    WHERE name IN (${names.join(", ")})
  `;
  const newPersons = insertablePersons.filter(
    (x) =>
      !existingPersons
        .map((existingPerson) => existingPerson.name)
        .includes(x.name)
  );
  const newInsertablePersons = newPersons.map((x) => ({
    id: uuid(),
    name: x.name,
  }));

  const table = new sql.Table("person");
  table.columns.add("id", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  table.columns.add("name", sql.VarChar, {
    nullable: false,
  });
  newInsertablePersons.forEach((x) => {
    table.rows.add(x.id, x.name);
  });

  await bulk(table);

  const resultingPersons = persons
    .filter((x) => x.id)
    .map((x) => x as Person)
    .concat(existingPersons)
    .concat(newInsertablePersons);

  return resultingPersons;
};
