import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import AccessToken from '#models/access_token'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = request.only(['full_name', 'email', 'password'])
    const user = await User.create(data)
    return response.created({ user })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
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
    })

    return response.ok({
      user,
      token: token.hash,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').user
    if (!user) return response.unauthorized({ error: 'Usuário não autenticado' })

    await AccessToken.query().where('tokenableId', user.id).delete()
    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
