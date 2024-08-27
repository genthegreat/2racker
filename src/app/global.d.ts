import type { Database as DB } from "@@/utils/db/database.types"

declare global {
    type Database = DB
}