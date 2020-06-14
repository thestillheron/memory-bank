import * as sql from "mssql";
import { bulk } from "../sqlConnection";

export const createLinks = async (
  memoryId: string,
  personIds: string[]
): Promise<void> => {
  const table = new sql.Table("memoryPerson");
  table.columns.add("memoryId", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  table.columns.add("personId", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  personIds.forEach((x) => {
    table.rows.add(memoryId, x);
  });

  await bulk(table);
};
