import { db } from "./database";

const query = db.prepare(`CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cat_id INTEGER,
    foreign key (cat_id) references cats(id)
    )
  `)

const query2 = db.prepare(`CREATE TABLE IF NOT EXISTS cats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    owner_id INTEGER,
    age INTEGER,
    color TEXT,
    favoriteToy TEXT
    )
  `)


query.run()
query2.run()
