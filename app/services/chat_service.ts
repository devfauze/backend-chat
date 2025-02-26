import Message from '#models/message'
import User from '#models/user'

export default class ChatService {
  static async saveMessage(userId: number, content: string) {
    const message = await Message.create({ userId, content })
    // @ts-ignore
    await message.load('user')
    return message
  }

  static async getMessages() {
    // @ts-ignore
    return Message.query().preload('user').orderBy('created_at', 'asc')
  }

  static async getUserById(userId: number) {
    return User.find(userId)
  }
}
