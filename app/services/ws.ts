import { Server, Socket } from 'socket.io'
import server from '@adonisjs/core/services/server'
import ChatService from '../services/chat_service.js'
import AccessToken from '../models/access_token.js'
import User from '#models/user'

class Ws {
  private io: Server | undefined
  private booted = false

  boot() {
    if (this.booted) return

    this.booted = true
    this.io = new Server(server.getNodeServer(), { cors: { origin: '*' } })

    this.io.on('connection', async (socket) => {
      const user = await this.authenticateUser(socket)

      if (!user) {
        return socket.disconnect()
      }

      await this.handleConnection(socket, user)
    })
  }

  private async authenticateUser(socket: Socket): Promise<User | null> {
    const token = socket.handshake.auth?.token

    if (!token) {
      return null
    }

    const accessToken = await AccessToken.findBy('hash', token)
    if (!accessToken) {
      return null
    }

    console.log('🔵 Token encontrado no banco:', accessToken)

    const user = await User.find(accessToken.tokenableId)
    if (!user) {
      return null
    }
    return user
  }

  private async handleConnection(socket: Socket, user: User) {
    const messages = await ChatService.getMessages()
    socket.emit('messages', messages)

    socket.on('message', (content: string) => this.handleMessages(socket, user, content))
    socket.on('disconnect', () => this.handleDisconnect(socket, user))
  }

  private async handleMessages(_socket: Socket, user: User, content: string) {
    const message = await ChatService.saveMessage(user.id, content)
    this.io?.emit('message', message)
  }

  private handleDisconnect(_socket: Socket, user: User) {
    console.log(`Usuário desconectado: ${user.fullName} (ID: ${user.id})`)
  }
}

export default new Ws()
