// @ts-ignore
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from './user.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column()
  public content!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  // @ts-ignore
  @belongsTo(() => User)
  public user!: belongsTo<typeof User>
}
