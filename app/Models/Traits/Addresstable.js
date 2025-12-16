"use strict";
const Env = use("Env");
const _ = require("lodash");
const AddressRepository = use("App/Modules/CRM/Repositories/EnderecoRepository");

class Address {
  register(Model) {
    // create methods
    const self = this;
    Model.address = function () {
      return {
        create: createWithAddress(self.ctx).bind(this),
      };
    };
  }
}

/**
 * Update with Address
 *
 * @param auth
 * @param request
 * @returns {*}
 *
function updateWithAddress(req) {
  return async function (data, trx, ignoreDiff = ["updated_at"]) {
    const Address = this.constructor.name;
    const AddressId = this.id;
    const oldData = _.omit(this.$originalAttributes, this.$hidden);
    this.merge(data);

    let result
    if (!trx) {
      result = await this.save();
    } else {
      result = await this.save(trx);
    }

    if (Env.get("NODE_ENV") !== "testing") {

      const newModel = (await this.constructor.find(this.primaryKeyValue));
      const newData = _.omit(newModel.$attributes, this.$hidden);

      // if new and old are equal then don't bother updating
      const isEqual = _.isEqual(
        _.omit(newData, ignoreDiff),
        _.omit(oldData, ignoreDiff),
      );
      if (isEqual) {
        return result;
      }

      // update / patch are shared
      const event = 'UPDATE';

      // save Address
      await createAddress(event, { request: req.request, auth: req.auth }, Address, AddressId, oldData,
        newData);
    }

    return result;
  };
}*/

/**
 * Run the Address
 *
 * @param event
 * @param oldData
 * @param Address
 * @param AddressId
 * @param auth
 * @param request
 * @returns {Promise<void>}
 */
async function createAddress({ request, auth }, address, addressId) {
  // check request was passed
  if (!request) {
    throw new Error("Request param is empty");
  }

  // get user data to store
  const user_id = await auth.getUser().id;
  const data = request.only([
    "pais_id",
    "provincia_id",
    "muninicipio_id",
    "distrito_id",
    "bairro",
    "rua",
    "residencia",
    "apt",
    "predio",
    "andar",
    "morada",
  ]);

  const address = await AddressRepository.create({
    ...data,
    user_id: user_id,
    address_id: addressId,
    address,
    created_at: new Date(),
  });
}

/**
 * Create with Address
 *
 * @param auth
 * @param request
 * @returns {*}
 */
function createWithAddress(req) {
  return async function (data, trx = null) {
    let model;
    if (!trx) {
      model = await this.create(data);
    } else {
      model = await this.create(data, trx);
    }
    if (Env.get("NODE_ENV") !== "testing") {
      const address = model.constructor.name;
      const addressId = model.id;
      // save Address
      await createAddress(
        { request: req.request, auth: req.auth },
        address,
        addressId
      );
    }
    return model;
  };
}

module.exports = Address;
