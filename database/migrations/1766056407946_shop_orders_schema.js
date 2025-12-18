"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ShopOrdersSchema extends Schema {
  up() {
    this.create("shop_orders", (table) => {
      table.increments();
      table.integer("order_id").unsigned().references("id").inTable("orders").onDelete("CASCADE");
      table.integer("shop_id").unsigned().references("id").inTable("shops");
      table.string("status", 30).defaultTo("PENDING");
      table.decimal("total_amount", 10, 2).defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("shop_orders");
  }
}

module.exports = ShopOrdersSchema;
