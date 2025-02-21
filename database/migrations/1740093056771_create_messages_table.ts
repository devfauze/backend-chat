import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Messages extends BaseSchema {
  async up() {
    this.schema.createTable('messages', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.text('content').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable('messages')
  }
}
