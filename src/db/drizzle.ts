import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres} from 'drizzle-orm/postgres-js';
import * as schema from "@/db/schema";
import postgres from "postgres";

neonConfig.fetchConnectionCache = true;

const setDatabase = () => {
  var environment = process.env.NODE_ENV
  var isDevelopment = environment === 'development'

  console.log(isDevelopment ? "Running in dev mode" : "Running in prod mode")

  if (isDevelopment) {
    // Use a postgres server for local development
    const sql = postgres(process.env.DRIZZLE_DATABASE_URL!, { max: 1 })
    return drizzlePostgres(sql, { schema });
  } else {
    // Production database is ran through a neon serverless postgres instance
    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    return drizzleNeon(sql, { schema });
  }
}

const db = setDatabase()

export default db;
