import type { HttpContext } from '@adonisjs/core/http'
import ChatService from '#services/chat_service'
import Ws from '#services/ws'
import validator from 'validator'

export default class MessagesController {
  async index({ request, response }: HttpContext) {
    const { room } = request.qs()
    if (!room) return response.badRequest({ error: 'Sala não informada' })

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const messages = await ChatService.getMessagesByRoom(room, page, limit)

    if (!Array.isArray(messages)) {
      return response.badRequest({ error: 'Erro ao obter mensagens' })
    }

    return response.ok(messages)
  }

  async store({ request, auth, response }: HttpContext) {
    const user = auth.user
    if (!user) return response.unauthorized({ error: 'Não autorizado' })

    let { content, room } = request.only(['content', 'room'])
    content = validator.trim(content)
    room = validator.trim(room)

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
    let { query, room } = request.qs()
    if (!query) return response.badRequest({ error: 'Termo de busca não informado' })
    if (!room) return response.badRequest({ error: 'Sala não informada' })

    query = validator.trim(query)
    room = validator.trim(room)

    const messages = await ChatService.searchMessages(query, room)
    return response.ok(messages)
  }
}
