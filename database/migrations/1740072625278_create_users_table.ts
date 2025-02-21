import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  async up() {
    this.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('full_name').nullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable('users')
  }
}
