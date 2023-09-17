import { catsTableSchema, db } from '../database'
import type { MethodFn } from '../server'

const get: MethodFn = (request, reply) => {
  const nameParam = request.searchParams?.get('name') ?? false
  const limitParam = request.searchParams.get('limit') ?? false

  console.debug({
    nameParam,
    limitParam
  })

  if (!nameParam) {
    const allCats = db.query(`SELECT * FROM cats LIMIT ?`).all(limitParam)
    reply(JSON.stringify(allCats))
  } else {
    const name = catsTableSchema.shape.name.parse(nameParam)
    const result = db
      .prepare(`SELECT * FROM cats WHERE name = ?`)
      .get(name)
    reply(JSON.stringify(result))
  }
}

const post: MethodFn = (request, reply) => {
  const data = catsTableSchema.parse(request.json)

  const query = db.query(`
    INSERT INTO cats (name, color, age, favoriteToy)
    VALUES (?1, ?2, ?3, ?4)
  `).run(...Object.values(data))

  reply('Cat created successfully')
}

const remove: MethodFn = (request, reply) => {
  const nameParam = request.searchParams?.get('name')
  const name = catsTableSchema.shape.name.parse(nameParam)

  db.query(`DELETE FROM cats WHERE name = ?`).run(name)
  reply("Gato borrado correctamente.", { status: 202 })
}

export {
  post,
  get,
  remove
}
