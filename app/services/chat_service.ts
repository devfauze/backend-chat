import Message from '../models/message.js'

export default class ChatService {
  static async saveMessage(userId: number, content: string) {
    return await Message.create({ userId, content })
  }

  static async getMessages() {
    return Message.query().preload('user').orderBy('created_at', 'asc')
  }
}
