import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public content!: string

  @column()
  public userId!: number

  // @ts-ignore
  @belongsTo(() => User)
  public user!: typeof User
}
