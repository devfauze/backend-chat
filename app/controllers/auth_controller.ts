import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import AccessToken from '#models/access_token'
import { DateTime } from 'luxon'
import validator from 'validator'
import { Database } from '@adonisjs/lucid/database'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let { full_name, email, password } = request.only(['full_name', 'email', 'password'])

    full_name = validator.escape(validator.trim(full_name))
    email = validator.escape(validator.trim(email))
    password = validator.trim(password)

    // @ts-ignore
    const user = await User.create({ full_name, email, password })
    return response.created({ user })
  }

  async login({ request, response }: HttpContext) {
    let { email, password } = request.only(['email', 'password'])

    email = validator.escape(validator.trim(email))
    password = validator.trim(password)

    const user = await User.findByOrFail('email', email)

    if (!(await hash.verify(user.password, password))) {
      return response.unauthorized({ error: 'Credenciais inválidas' })
    }

    const token = await AccessToken.create({
      tokenableId: user.id,
      type: 'api',
      name: 'auth_token',
      hash: await hash.make(user.id.toString()),
      abilities: JSON.stringify(['*']),
      expiresAt: DateTime.now().plus({ minutes: 30 }),
    })

    return response.ok({
      user,
      token: token.hash,
      expiresAt: token.expiresAt,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (!user) return response.unauthorized({ error: 'Usuário não autenticado' })

    // @ts-ignore
    await Database.from('access_tokens').where('tokenableId', user.id).delete()
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
