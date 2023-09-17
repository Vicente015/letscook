/**
 * HTTP Server that servers AN API
 * @link https://bun.sh/docs/api/http
 * https://nodejs.org/en/docs/guides/getting-started-guide
 */

import { z } from 'zod'
import { readdirSync } from 'node:fs'

type AdvancedRequest = Request & {
  searchParams: URLSearchParams,
  url: URL,
  json: unknown | undefined
}
export type ReplyFn = (body: ConstructorParameters<typeof Response>[0], options?: ConstructorParameters<typeof Response>[1]) => Response
export type MethodFn = (request: AdvancedRequest, reply: ReplyFn) => void

export interface Route {
  post: MethodFn
  get: MethodFn
  remove: MethodFn
}

const routes = readdirSync('src/api/')
  .map(route => route.split('.')[0])

const server = Bun.serve({
  port: Bun.env.PORT,
  async fetch(request) {
    const url = new URL(request.url)
    const [, apiVersion, route] = url.pathname.split('/')
    let response: Response | null = null

    /**
     * Replies to the request with a response
     */
    const reply: ReplyFn = (body, options?) => {
      response = new Response(body, options)
      return response
    }

    // ? Si no incluye v1
    if (apiVersion !== ('v1')) throw new Error('No API Version.')
    if (!routes.includes(route)) throw new Error(`Not valid API route. Valid ones are: ${routes.join(', ')}`)

    const advancedRequest: AdvancedRequest = {
      ...request,
      searchParams: url.searchParams,
      url,
      json: request.body ? await request.json() : undefined
    }

    const file: Route = await import(`./api/${route}`)

    switch (request.method) {
      case 'GET':
        file.get(advancedRequest, reply)
        break
      case 'POST':
        file.post(advancedRequest, reply)
        break
      case 'DELETE':
        file.remove(advancedRequest, reply)
        break
      default:
        throw new Error('Unsupported HTTP method.')
    }

    return response || new Response('Not found', { status: 404 });
  },
  error(error) {
    console.error('Error', error)
    return new Response('Error' + error, { status: 500 })
  }
})

console.log(`Servidor escuchando en el puerto ${server.port}`)
