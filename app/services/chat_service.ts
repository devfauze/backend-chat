import Message from '#models/message'
import User from '#models/user'

export default class ChatService {
  static async saveMessage(userId: number, content: string, room: string) {
    const message = await Message.create({ userId, content, room })
    // @ts-ignore
    await message.load('user')
    return message
  }

  static async getMessagesByRoom(room: string) {
    // @ts-ignore
    return Message.query().where('room', room).preload('user').orderBy('created_at', 'asc')
  }

  static async getUserById(userId: number) {
    return User.find(userId)
  }
}
