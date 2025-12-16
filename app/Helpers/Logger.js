'use strict'
const {saveLog} = require('logger-winston-js');
const DecodeToken = require("./DecodeToken");

const register = async(level, error, request) => {
  const userData = request ? await getUser(request) : null
  await saveLog({
    level: level,
    appName: "Core",
    ip: request && request.ip(),
    route: request && request.url(),
    userData: userData,
    error: error
  })
}

const getUser = async(request) => {
  try {
    const { authorization } = await request.headers();
    const {user} = await DecodeToken.decodeAuthorization(authorization).data
    return {id: user.id, name: user.name, email: user.email }
  } catch (error) {
    return null
  }
}

module.exports = {register: register}

