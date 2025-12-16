"use strict";

const Drive = use("Drive");
const Helpers = use("Helpers");
const { v4: uuidv4 } = require("uuid");
const InternalServerException = use("App/Exceptions/InternalServerException");

const defaultPath = "storage/app/public/uploads";

function stringToSlug(value){
  return value.toString().toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with -
      .replace(/[^\w.\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');
}

async function generateNewNameIfExists(folder, filename, i = 0){
  const isExist = await Drive.exists(`${folder}/${stringToSlug((i==0?"":i)+filename)}`);
  let n = i+1;
  if(isExist){
    return generateNewNameIfExists(folder, stringToSlug(filename), n)
  }
  return stringToSlug((i==0?"":i)+filename);
}

function deleteFile(originalFileName) {
    const fs = Helpers.promisify(require("fs"));
    fs.unlink(Helpers.tmpPath(originalFileName));
}

async function uploadFile(file, folder = null, name = null, overwrite = false) {
  const filename = name || `${uuidv4()}.${file.extname}`;
  await file.move(Helpers.tmpPath(folder || defaultPath), {
    name: filename,
    overwrite: overwrite,
  });

  if (!file.moved()) {
    throw new InternalServerException(file.error());
  }

  return filename;
}

module.exports = {
    uploadFile,
    deleteFile,
    generateNewNameIfExists,
    defaultPath
}
