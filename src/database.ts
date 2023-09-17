/**
 * Database logic
 * @link https://bun.sh/docs/api/sqlite
 */

import { Database } from 'bun:sqlite'
import { z } from 'zod';

const db = new Database("database.sqlite", { create: true });

const catsTableSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  color: z.string(),
  age: z.number().max(20).positive(),
  favoriteToy: z.string(),
  owner_id: z.number().optional()
})

const ownersTableSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  pet_id: z.number().optional()
})

export { db, catsTableSchema, ownersTableSchema }
