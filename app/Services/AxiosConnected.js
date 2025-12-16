const axios = require("axios").default;
class AxiosConnected {

  constructor(baseURL=null, APP_KEY=null) {
    this.baseURL = baseURL;
    this.APP_KEY = APP_KEY
    axios.defaults.headers.common['X-REQUEST-KEY'] = this.APP_KEY;
    axios.defaults.baseURL = this.baseURL;
  }
  /**
   *
   * @param {*} url
   * @param {*} params
   * @returns
   */
  async get(path, params) {

    return await axios
      .get(`${path}`)
      .then((res) => {
        return { statusCode: res.status, ...res.data };
      })
      .catch((error) => {
        return this.testConnection(error);
      });
  }

  /**
   *
   * @param path
   * @param body
   * @returns
   */
  async post(path, body = {}, options = {}) {
    return await axios
      .post(`${path}`, body, options)
      .then((res) => {
        return { statusCode: res.status, ...res.data };
      })
      .catch((error) => {
        console.log(error);
        
        return this.testConnection(error);
      });
  }


  /**
   *
   * @param path
   * @param body
   * @returns
   */
  async delete(path, body = {}) {
    return await axios
      .delete(`/${path}`, { data: body })
      .then((res) => {
        return { statusCode: res.status, ...res.data };
      })
      .catch((error) => {
        return this.testConnection(error);
      });
  }

  /**
   *
   * @param path
   * @param body
   * @returns
   */
  async put(path, body = {}) {
    return await axios
      .put(`/${path}`, body)
      .then((res) => {
        return { statusCode: res.status, ...res.data };
      })
      .catch((error) => {
        return this.testConnection(error);
      });
  }
  /**
   *
   * @param path
   * @param body
   * @returns
   */
  async patch(path, body = {}) {
    return await axios
      .patch(`/${path}`, body)
      .then((res) => {
        return { statusCode: res.status, ...res.data };
      })
      .catch((error) => {
        return this.testConnection(error);
      });
  }

  /**
   *
   * @param path
   * @param body
   * @returns
   */
   async request(RequestConfig) {
      return await axios.request(RequestConfig).catch((error) => {
        console.log(error)
        return this.testConnection(error);
      });
  }

   /**
   *
   * @param {*} to
   * @param {*} text
   * @returns
   */
  async channel({ credentials, to,text },url, axiosPayloadChannel='params', httpMethod='get') {
    return await
    this.request({
      url,
        method: httpMethod,
        [axiosPayloadChannel]: {
            ...credentials,
            to: to,
            text: text
        },
      })
      .then((res) => {
        res.status =  res.data=='ERR: 001, Authentication failed'?502:res.status;
        if(res.status!=200) "error"//throw new NotBadGatewayException();
        return res.status;
      });
  }
  testConnection(error) {
    if (error.code != undefined) {
      error = {
        ...error,
        response: {
          status: 502,
          data: {
            message: `Erro de ligação. A entidade externa recusou a operação, Por favor tente novamente`,
          },
        },
      };
    }
    return { ...error.response, statusCode: error.response.status };
  }
}
module.exports = AxiosConnected;
