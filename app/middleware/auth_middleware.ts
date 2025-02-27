import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AccessToken from '#models/access_token'
import User from '#models/user'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(ctx: HttpContext, next: NextFn) {
    let token = ctx.request.header('authorization')?.split(' ')[1] || ctx.request.cookie('token')

    if (!token) {
      return ctx.response.unauthorized({ error: 'Token não fornecido' })
    }

    const accessToken = await AccessToken.query().where('hash', token).first()

    if (!accessToken) {
      return ctx.response.unauthorized({ error: 'Token inválido' })
    }

    const user = await User.find(accessToken.tokenableId)
    if (!user) {
      return ctx.response.unauthorized({ error: 'Usuário não encontrado' })
    }

    ctx.auth = { user } as any

    return next()
  }
}
