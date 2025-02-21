import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'
import ChatService from '../services/chat_service.js'
import AccessToken from '../models/access_token.js'
import User from '../models/user.js'

class Ws {
  io: Server | undefined
  private booted = false

  boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
      },
    })

    this.io.on('connection', async (socket) => {
      console.log(`Usuário conectado: ${socket.id}`)

      const token = socket.handshake.auth?.token
      let user = null
      if (token) {
        const accessToken = await AccessToken.findBy('hash', token)
        if (accessToken) {
          user = await User.find(accessToken.tokenableId)
        }
      }

      if (!user) {
        console.log('Usuário não autenticado.')
        socket.disconnect()
        return
      }

      const messages = await ChatService.getMessages()
      socket.emit('messages', messages)

      socket.on('message', async (content: string) => {
        const message = await ChatService.saveMessage(user.id, content)
        this.io?.emit('message', message)
      })

      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`)
      })
    })
  }
}

export default new Ws()
