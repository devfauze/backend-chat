import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public content!: string

  @column()
  public userId!: number

  @column()
  public room!: string

  // @ts-ignore
  @column.dateTime({ columnName: 'created_at' })
  public createdAt!: Date

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>
}
