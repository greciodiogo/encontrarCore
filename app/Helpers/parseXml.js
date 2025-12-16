var builder = require("xmlbuilder");
module.exports = async (data) => {
  return new Promise((resolve, reject) => {
    if (data) {
      var feed = builder
        .create(data, { encoding: "utf-8" })
        .end({ pretty: true });
      resolve(feed);
    } else {
      reject({
        err: "No file name provided",
      });
    }
  });
};
