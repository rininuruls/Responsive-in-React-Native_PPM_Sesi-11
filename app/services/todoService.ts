import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("databaseName");
  }
  return db;
}

export type Todo = {
  id?: number;
  text: string;
  done: number; // 0 or 1
  created_at?: string | null;
  finished_at?: string | null;
};

/** Create table and safe migration for finished_at; add index for performance */
export async function initDB(): Promise<void> {
  const db = await getDB();

  // Create table including finished_at for fresh DBs
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now')),
      finished_at DATETIME
    );
  `);

  // Ensure index on finished_at for faster range queries
  try {
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_todos_finished_at ON todos(finished_at);`);
  } catch (err) {
    // ignore
  }

  // Migration: add finished_at if missing (older DB)
  try {
    const cols = await db.getAllAsync<{ name: string }>("PRAGMA table_info(todos);");
    const hasFinishedAt = cols.some((c) => c.name === "finished_at");
    if (!hasFinishedAt) {
      await db.execAsync("ALTER TABLE todos ADD COLUMN finished_at DATETIME;");
    }
  } catch (err) {
    // silent; migration best-effort
    // console.warn("Migration check failed", err);
  }
}

/** Map raw row to Todo */
function mapRowToTodo(row: any): Todo {
  return {
    id: typeof row.id === "number" ? row.id : Number(row.id),
    text: row.text,
    done: typeof row.done === "number" ? row.done : Number(row.done),
    created_at: row.created_at ?? null,
    finished_at: row.finished_at ?? null,
  };
}

/** Get all todos; filter by status */
export async function getTodos(status: "all" | "done" | "undone" = "all"): Promise<Todo[]> {
  const db = await getDB();

  let query = "SELECT * FROM todos";
  const params: any[] = [];

  if (status === "done") {
    query += " WHERE done = 1";
  } else if (status === "undone") {
    query += " WHERE done = 0";
  }

  query += " ORDER BY id DESC;";

  const rows = await db.getAllAsync<any>(query, params);
  return Array.isArray(rows) ? rows.map(mapRowToTodo) : [];
}

/** Get one todo by id */
export async function getTodoById(id: number): Promise<Todo | null> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>("SELECT * FROM todos WHERE id = ? LIMIT 1;", [id]);
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return mapRowToTodo(rows[0]);
}

/** Insert todo (optionally mark done on create) */
export async function addTodo(text: string, done: number = 0): Promise<number> {
  const db = await getDB();

  if (done === 1) {
    const res = await db.runAsync(
      "INSERT INTO todos (text, done, finished_at) VALUES (?, 1, datetime('now'));",
      [text]
    );
    return (res as any).lastInsertRowId ?? 0;
  } else {
    const res = await db.runAsync("INSERT INTO todos (text, done) VALUES (?, 0);", [text]);
    return (res as any).lastInsertRowId ?? 0;
  }
}

/** Update todo; automatically set/clear finished_at when changing done */
export async function updateTodo(
  id: number,
  fields: { text?: string; done?: number }
): Promise<void> {
  const db = await getDB();

  const sets: string[] = [];
  const params: any[] = [];

  if (fields.text !== undefined) {
    sets.push("text = ?");
    params.push(fields.text);
  }

  if (fields.done !== undefined) {
    sets.push("done = ?");
    params.push(fields.done);
    if (fields.done === 1) {
      sets.push("finished_at = datetime('now')");
    } else {
      sets.push("finished_at = NULL");
    }
  }

  if (sets.length === 0) return;

  params.push(id);
  await db.runAsync(`UPDATE todos SET ${sets.join(", ")} WHERE id = ?;`, params);
}

/** Delete todo */
export async function deleteTodo(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync("DELETE FROM todos WHERE id = ?;", [id]);
}

/** -------------------------
 * New helper functions
 * ------------------------- */

/**
 * Get todos filtered by a date range (inclusive).
 * startISO and endISO should be strings recognized by SQLite datetime(),
 * e.g. "2025-01-01 00:00:00" or "2025-01-01".
 *
 * opts.by = "finished_at" | "created_at"
 * opts.status = "all" | "done" | "undone"
 */
export async function getTodosByDateRange(
  startISO: string,
  endISO: string,
  opts?: { by?: "finished_at" | "created_at"; status?: "all" | "done" | "undone" }
): Promise<Todo[]> {
  const db = await getDB();
  const by = opts?.by ?? "finished_at";
  const status = opts?.status ?? "all";

  let query = `SELECT * FROM todos WHERE ${by} IS NOT NULL AND ${by} BETWEEN datetime(?) AND datetime(?)`;
  const params: any[] = [startISO, endISO];

  if (status === "done") query += " AND done = 1";
  else if (status === "undone") query += " AND done = 0";

  query += " ORDER BY id DESC;";

  const rows = await db.getAllAsync<any>(query, params);
  return Array.isArray(rows) ? rows.map(mapRowToTodo) : [];
}

/**
 * Simple text search on todo.text (case-insensitive depending on SQLite collation).
 * Uses LIKE with wildcard.
 */
export async function searchTodos(q: string): Promise<Todo[]> {
  const db = await getDB();
  const like = `%${q}%`;
  const rows = await db.getAllAsync<any>("SELECT * FROM todos WHERE text LIKE ? ORDER BY id DESC;", [like]);
  return Array.isArray(rows) ? rows.map(mapRowToTodo) : [];
}

/** Debug: print all rows to console (metro) */
export async function debugPrintTodos(): Promise<void> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>("SELECT * FROM todos ORDER BY id DESC;", []);
  console.log("DEBUG TODOS:", rows);
}

export default {
  initDB,
  getTodos,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodosByDateRange,
  searchTodos,
  debugPrintTodos,
};