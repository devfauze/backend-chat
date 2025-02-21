import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AuthAccessTokens extends BaseSchema {
  async up() {
    this.schema.createTable('auth_access_tokens', (table) => {
      table.increments('id')
      table.integer('tokenable_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('name').notNullable()
      table.string('hash').notNullable()
      table.string('abilities').notNullable()
      table.timestamp('last_used_at', { useTz: true }).nullable()
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('auth_access_tokens')
  }
}
