import { Server, Socket } from 'socket.io'
import server from '@adonisjs/core/services/server'
import ChatService from '#services/chat_service'
import AccessToken from '#models/access_token'
import User from '#models/user'

class Ws {
  io: Server | undefined
  private booted = false

  boot() {
    if (this.booted) return
    this.booted = true

    this.io = new Server(server.getNodeServer(), { cors: { origin: '*' } })

    this.io.on('connection', async (socket) => {
      const user = await this.authenticateUser(socket)

      if (!user) {
        socket.disconnect()
        return
      }

      this.handleConnection(socket, user)
    })
  }

  private async authenticateUser(socket: Socket): Promise<User | null> {
    const token = socket.handshake.auth?.token
    if (!token) return null

    const accessToken = await AccessToken.findBy('hash', token)
    if (!accessToken) return null

    return ChatService.getUserById(accessToken.tokenableId)
  }

  private async handleConnection(socket: Socket, user: User) {
    socket.on('joinRoom', async (room: string) => {
      socket.join(room)

      const messages = await ChatService.getMessagesByRoom(room)
      socket.emit('messages', messages)
    })

    socket.on('message', ({ room, content }) => this.handleMessage(socket, user, room, content))

    socket.on('typing', (room: string) => {
      socket.to(room).emit('typing', { userId: user.id, fullName: user.fullName })
    })

    socket.on('stop_typing', (room: string) => {
      socket.to(room).emit('stop_typing', { userId: user.id })
    })

    socket.on('disconnect', () => this.handleDisconnect(user))
  }

  private async handleMessage(_socket: Socket, user: User, room: string, content: string) {
    const message = await ChatService.saveMessage(user.id, content, room)
    this.io?.to(room).emit('message', message)
  }

  private handleDisconnect(user: User) {
    console.log(`❌ Usuário desconectado: ${user.fullName} (ID: ${user.id})`)
  }
}

export default new Ws()
