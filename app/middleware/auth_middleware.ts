import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AccessToken from '#models/access_token'
import User from '#models/user'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader) {
      return ctx.response.unauthorized({ error: 'Token não fornecido' })
    }

    const [, token] = authHeader.split(' ')

    const accessToken = await AccessToken.findBy('hash', token)
    if (!accessToken) {
      return ctx.response.unauthorized({ error: 'Token inválido' })
    }

    const user = await User.find(accessToken.tokenableId)
    if (!user) {
      return ctx.response.unauthorized({ error: 'Usuário não encontrado' })
    }

    Object.defineProperty(ctx.auth, 'user', {
      value: user,
      writable: false,
      enumerable: true,
    })

    return next()
  }
}
