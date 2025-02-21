import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AccessToken extends BaseModel {
  public static table = 'auth_access_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenableId: number

  @column()
  declare tokenableType: string

  @column()
  declare type: string

  @column()
  declare name: string

  @column()
  declare hash: string

  @column()
  declare abilities: string

  @column()
  declare lastUsedAt: Date

  @column()
  declare expiresAt: Date
}
