"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const FormRepository = use(
  "App/Modules/Utilitarios/Repositories/FormRepository"
);


class FormController {
    #formRepo;

  constructor() {
    this.#formRepo = new FormRepository();
  }
}

module.exports = FormController;
