import Message from '#models/message'
import User from '#models/user'
import validator from 'validator'

export default class ChatService {
  static async saveMessage(userId: number, content: string, room: string) {
    const message = await Message.create({ userId, content, room })
    await message.load('user')

    return message
  }

  static async getMessagesByRoom(room: string, page: number = 1, limit: number = 10) {
    const messages = await Message.query()
      .where('room', room)
      .preload('user')
      .orderBy('created_at', 'asc')
      .paginate(page, limit)

    return messages
  }

  static async getUserById(userId: number) {
    return User.find(userId)
  }

  static async searchMessages(query: string, room: string) {
    query = validator.escape(validator.trim(query))
    room = validator.trim(room)

    const messages = await Message.query()
      .where('room', room)
      .andWhereRaw('LOWER(content) LIKE ?', [`%${query.toLowerCase()}%`])
      .preload('user')
      .orderBy('created_at', 'desc')

    return messages
  }
}
