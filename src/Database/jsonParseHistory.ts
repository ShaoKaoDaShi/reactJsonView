// db.ts
import Dexie, { type EntityTable } from "dexie";

interface JsonParseHistory {
  id: number;
  jsonString: string;
  date: number;
}

const db = new Dexie("FriendsDatabase") as Dexie & {
  jsonParseHistory: EntityTable<
    JsonParseHistory,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  jsonParseHistory: "++id, jsonString, date", // primary key "id" (for the runtime!)
});

export type { JsonParseHistory };
export { db };
