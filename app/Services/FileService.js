"use strict";

const path = require("path");
const fs = require("fs");
const fileHelpers = use("App/Helpers/fileService"); 
const Env = use("Env");
class FileService {

  /**
   * 
   * @param {*} base64 
   * @param {*} display_name 
   * @param {*} extension 
   * @param {*} type_name 
   * @returns 
   */
  async convertFromBase64(base64, display_name,extension, type_name) {
    let reg = new RegExp(/data:(.*);base64/gi);
    let mime = reg.exec(base64)[1];
    const file = await this.dataUrlToFile(base64);
    // let extension = mime.split("/")[1];
    return this.upload(file, display_name, extension,type_name);
  }

  async dataUrlToFile(dataUrl) {
    let base64 = dataUrl.split(';base64,').pop();
    const fileBuffer = Buffer.from(base64, "base64");
    return fileBuffer
  }
  /**
   * 
   * @param {*} file 
   * @param {*} displayName 
   * @param {*} extension 
   * @param {*} typeName 
   * @returns 
   */
  async upload(file, displayName,extension="",typeName) {
    const folder = fileHelpers.removerAcentosEspaco(typeName);
    const linkToDatabase = `storage/public/uploads/${folder}/`;
    var PATH =  Env.get("PATH_STORAGE_ANEXOS") ; 
    if(!fileHelpers.checkIfEmpty(PATH)){
      PATH = PATH+"/";
    }
    PATH = `${PATH}storage/public/uploads/${folder}/${displayName}.${extension}`; 

     await fileHelpers.createDir(folder, Env.get("PATH_STORAGE_ANEXOS"))
     await fs.writeFileSync(PATH, file);
    return `/${linkToDatabase}/${displayName}`;
  }
}


 
module.exports = FileService;
