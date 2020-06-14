import * as sql from "mssql";
import { bulk } from "../sqlConnection";

export const createLinks = async (
  memoryId: string,
  tagIds: string[]
): Promise<void> => {
  const table = new sql.Table("memoryTag");
  table.columns.add("memoryId", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  table.columns.add("tagId", sql.VarChar, {
    nullable: false,
    primary: true,
  });
  tagIds.forEach((x) => {
    table.rows.add(memoryId, x);
  });

  await bulk(table);
};
