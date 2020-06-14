import * as sql from "mssql";
import { v4 as uuid } from "uuid";

export interface QueryParameter {
  type: sql.ISqlType;
  value: any;
}

export interface QueryParameters {
  [key: string]: QueryParameter;
}

let currentTransaction: sql.Transaction | undefined;

interface Request {
  query: {
    strings: TemplateStringsArray;
    interpolations: string[];
  };
  promise: Promise<any>;
  id: string;
}

let pendingRequests: Request[] = [];

export const attemptRetryable = async (
  callback: () => Promise<any>
): Promise<any> => {
  let attempts = 0;
  const maxAttempts = 5;
  while (attempts < maxAttempts) {
    try {
      await callback();
      return;
    } catch (e) {
      attempts++;
      if (
        !e.message ||
        typeof e.message !== "string" ||
        (!e.message.includes("in progress.") &&
          !e.message.includes("not the SentClientRequest"))
      ) {
        console.log(e);
        throw e;
      }
      const sleepTimeout = 100;
      await new Promise((resolve) => setTimeout(resolve, sleepTimeout));
    }
  }
};

export const startTransaction = async (): Promise<sql.Transaction> => {
  if (!currentTransaction) {
    const sessionPool = await getSessionPool();
    try {
      currentTransaction = sessionPool.transaction();
      await currentTransaction.begin();
    } catch (e) {
      // Try again after 1.5 seconds, then fail
      await new Promise((resolve, reject) => {
        const timeout = 1500;
        setTimeout(resolve, timeout);
      });
      currentTransaction = sessionPool.transaction();
      await currentTransaction.begin();
    }
  }
  return currentTransaction;
};

export const commitTransaction = async (): Promise<void> => {
  await attemptRetryable(async () => {
    if (currentTransaction) {
      try {
        await Promise.all(pendingRequests.map((x) => x.promise));
      } catch (e) {
        await rollbackTransaction();
      }
      await currentTransaction.commit();
    }
    currentTransaction = undefined;
  });
};

export const rollbackTransaction = async (): Promise<void> => {
  await attemptRetryable(async () => {
    if (currentTransaction) {
      try {
        await Promise.all(pendingRequests.map((x) => x.promise));
      } catch (error) {}
      await currentTransaction.rollback();
    }
    currentTransaction = undefined;
  });
};

const getConfig = () => {
  if (
    !process.env.SQL_SERVER ||
    !process.env.SQL_DATABASE ||
    !process.env.SQL_USERNAME ||
    !process.env.SQL_PASSWORD
  ) {
    throw new Error("Not configured");
  }

  if (process.env.NODE_ENV === "test") {
    return {
      user: process.env.SQL_USERNAME,
      password: process.env.SQL_PASSWORD,
      server: process.env.SQL_SERVER,
      database: process.env.SQL_DATABASE,
      options: {
        enableArithAbort: true,
        enableImplicitTransaction: true,
      },
      pool: {
        min: 1,
        max: 1,
      },
    };
  }

  return {
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
      enableArithAbort: true,
    },
  };
};

let pool: sql.ConnectionPool;
export const getSessionPool = async (): Promise<sql.ConnectionPool> => {
  if (pool) {
    return pool;
  }
  pool = new sql.ConnectionPool(getConfig());
  await pool.connect();
  pool.on("error", (err) => {
    throw err;
  });
  return pool;
};

export const closeGlobalPool = async (): Promise<void> => {
  // @ts-ignore DefinitelyTyped is broken for mssql
  await sql.close();
};

// We convert nulls in responses to undefined
// because that's what javascript/typescript expect for optional
// property values
const washResult = (recordSet: any[]): any[] => {
  if (!recordSet || recordSet.length === 0) {
    return recordSet;
  }
  const newRecordSet: any[] = [];
  for (const record of recordSet) {
    const newRecord: any = {};
    if (typeof record === "object" && record !== null) {
      for (const entry of Object.entries(record)) {
        newRecord[entry[0]] = entry[1] === null ? undefined : entry[1];
      }
      newRecordSet.push(newRecord);
    } else {
      newRecordSet.push(record);
    }
  }
  return newRecordSet;
};

// For when you expect multiple rows as a result
export const query = async <T>(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): Promise<T[]> => {
  const id = uuid();
  const requestPromise = new Promise<T[]>(async (resolve, reject) => {
    const index = pendingRequests.findIndex((x) => x.id === id);
    const otherPendingRequests = pendingRequests.slice(index);
    try {
      await attemptRetryable(async () => {
        await Promise.all(otherPendingRequests.map((x) => x.promise));
        const result = await processPendingRequest<T>(
          strings,
          ...interpolations
        );
        resolve(result);
      });
    } catch (e) {
      reject(e);
    } finally {
      pendingRequests = pendingRequests.filter((x) => x.id !== id);
    }
  });
  pendingRequests.push({
    query: {
      strings,
      interpolations,
    },
    promise: requestPromise,
    id,
  });
  return requestPromise;
};

const processPendingRequest = async <T>(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): Promise<T[]> => {
  if (currentTransaction) {
    const requestQuery = currentTransaction
      .request()
      .query(strings, ...interpolations);
    return washResult((await requestQuery).recordset);
  }
  const sessionPool = await getSessionPool();
  const result = await sessionPool.query(strings, ...interpolations);
  return washResult(result.recordset);
};

// For when you expect one row as a result
export const queryOne = async <T>(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): Promise<T | undefined> => (await query<T>(strings, ...interpolations))[0];

export const dynamicTableSqlQuery = async <T>(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): Promise<T[]> => {
  const TWO = 2;
  // @ts-ignore
  const table = interpolations.shift();
  const select = strings[0];
  const newStrings: string[] = [
    select + table + " " + strings[1],
    ...strings.raw.slice(TWO),
  ];

  return await query(
    (newStrings as unknown) as TemplateStringsArray,
    ...interpolations
  );
};

export const findById = <T extends { id: string }>(
  id: string | undefined,
  list: T[] | undefined
) =>
  (id && list ? list.find((x: { id: string }) => x.id === id) : undefined) as T;

export const bulk = async <T>(table: sql.Table): Promise<void> => {
  if (currentTransaction) {
    await currentTransaction.request().bulk(table);
    return;
  }
  const sessionPool = await getSessionPool();
  await sessionPool.request().bulk(table);
};
