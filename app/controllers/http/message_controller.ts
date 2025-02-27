import type { HttpContext } from '@adonisjs/core/http'
import ChatService from '#services/chat_service'
import Ws from '#services/ws'

export default class MessagesController {
  async index({ request, response }: HttpContext) {
    const { room } = request.qs()
    if (!room) return response.badRequest({ error: 'Sala não informada' })

    const messages = await ChatService.getMessagesByRoom(room)
    return response.ok(messages)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ error: 'Não autorizado' })

    const { content, room } = request.only(['content', 'room'])
    if (!content) return response.badRequest({ error: 'Mensagem vazia' })
    if (!room) return response.badRequest({ error: 'Sala não informada' })

    const message = await ChatService.saveMessage(user.id, content, room)

    Ws.io?.emit('message', {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      userId: message.userId,
      room: message.room,
      user: { name: user.fullName },
    })

    return response.created(message)
  }

  async search({ request, response }: HttpContext) {
    const { query, room } = request.qs()
    if (!query) return response.badRequest({ error: 'Termo de busca não informado' })
    if (!room) return response.badRequest({ error: 'Sala não informada' })

    const messages = await ChatService.searchMessages(query, room)
    return response.ok(messages)
  }
}
