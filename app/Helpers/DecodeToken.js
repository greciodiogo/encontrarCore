/**
 * @param {String} authorization
 */
 const decodeAuthorization = (authorization) => {
  const authorizationWithoutBearer = authorization.replace(/Bearer /, '')
  return decodeToken(authorizationWithoutBearer)
}

/**
 * @description private method to decode token
 * @param {String} token
 * @author Acidiney Dias <acidineydias@gmail.com>
 */
const decodeToken = (token) => {
  try {
    const base64HeaderUrl = token.split('.')[1];
    const base64Header = base64HeaderUrl.replace('-', '+').replace('_', '/');
    const headerData = JSON.parse(
      Buffer.from(base64Header, 'base64').toString()
    );
    return headerData;
  } catch (error) {
    return false;
  }
};

module.exports = {
  decodeAuthorization
}
