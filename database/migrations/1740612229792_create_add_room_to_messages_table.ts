import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRoomToMessages extends BaseSchema {
  async up() {
    this.schema.alterTable('messages', (table) => {
      table.string('room').notNullable().defaultTo('general')
    })
  }

  async down() {
    this.schema.alterTable('messages', (table) => {
      table.dropColumn('room')
    })
  }
}
