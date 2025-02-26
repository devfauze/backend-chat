import type { HttpContext } from '@adonisjs/core/http'
import ChatService from '#services/chat_service'
import Ws from '#services/ws'

export default class MessagesController {
  async index({ response }: HttpContext) {
    return response.ok(await ChatService.getMessages())
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ error: 'Não autorizado' })

    const { content } = request.only(['content'])
    const message = await ChatService.saveMessage(user.id, content)

    Ws.io?.emit('message', {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      userId: message.userId,
      user: { name: user.fullName },
    })

    return response.created(message)
  }
}
