import type { HttpContext } from '@adonisjs/core/http'
import Message from '../../models/message.js'

export default class MessagesController {
  async index({ response }: HttpContext) {
    const messages = await Message.query()
      .preload('user', (query) => {
        query.select('id', 'full_name')
      })
      .orderBy('created_at', 'asc')
    return response.ok(messages)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ error: 'Não autorizado' })

    const { content } = request.only(['content'])

    const message = await Message.create({ userId: user.id, content })
    return response.created(message)
  }
}
