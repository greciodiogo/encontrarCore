const fs = require("fs");
const crypto = require("crypto");
const Helpers = use("Helpers");
const NotFoundException = use("App/Exceptions/NotFoundException");
const Env = use("Env");
const new_base_path = Env.get("PATH_STORAGE_ANEXOS");
const FnConvert = use("App/Helpers/FnConvert");
async function genareteFileName(file) {
  const currentDate = new Date();
  const uuid = crypto.randomBytes(10).toString("hex");
  const fileName = `file_${uuid}_${currentDate.getDate()}${
    currentDate.getMonth() + 1
  }_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getSeconds()}.${
    file.subtype
  }`;

  await moveFile({ fileName, file });
  return fileName;
}

async function moveFile({ fileName, file }) {
  fileName = removerAcentosEspaco(fileName);
  await file.move(Helpers.publicPath("uploads"), { name: fileName });
  if (!file.moved()) {
    return file.error();
  }
}

async function getFilePath(fileName, path="storage/public/uploads/") {
  fileName = removerAcentosEspaco(fileName);
   const file_path = `${path}/${fileName}`;
  await checkFilePath(file_path);
  return file_path;
}

async function readFilePath(fileName, path="storage/public/uploads/") { 
  var file_path =`${path}/${fileName}`;
  if(!checkIfEmpty(new_base_path)){
    file_path = `${new_base_path}/${path}/${fileName}`;
  }

  //const file_path =Env.get("PATH_STORAGE_ANEXOS")!=null? `${new_base_path}/${path}/${fileName}`: `${path}/${fileName}`;
  await checkFilePath(file_path);
  return file_path;
}

async function checkFilePath(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new NotFoundException("Ficheiro Não encontrado");
  }
}
// remover ficheiro
async function deleteFile(fileName) {
  const filePath = await getFilePath(fileName);
  fs.unlinkSync(filePath);
}

function getFileFormat(file) {
  return file.subtype;
}

function fileName(typeFile) {
  typeFile = removerAcentosEspaco(typeFile);
  const currentDate = new Date();
  const uuid = crypto.randomBytes(10).toString("hex");
  const fileName = `file_${uuid}_${currentDate.getDate()}${
    currentDate.getMonth() + 1
  }_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getSeconds()}_${typeFile}`;

  return fileName;
}

function fileExtension(base64) {
  let reg = new RegExp(/data:(.*);base64/gi);
  let mime = reg.exec(base64)[1];
  let extension = mime.split("/")[1];
  return extension;
}

function  createDir(directory, dirname=null) {
  directory = removerAcentosEspaco(directory)
  var dir = dirname==null || dirname==""?"storage":`${dirname}/storage`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(dir + "/public");
    fs.mkdirSync(dir + "/public/uploads");
    fs.mkdirSync(`${dir}/public/uploads/${directory}`);
  } else {
    dir = `${dir}/public/uploads/${directory}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  return dir
}

 function getFileSizeInBytes(filename, valid=false) {        
        if(valid){
          if (!fs.existsSync(filename)) {
            return false;
          }
        } 
        var stats = fs.statSync(filename); 
        var fileSizeInBytes =  FnConvert.convertFromBytes(stats.size); 
        return fileSizeInBytes;
  } 
   
function removerAcentosEspaco(str) {
  str = str.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
  .replace(/\s/g,"").normalize("NFD").replace(/[^a-zA-Z\s]/g, ""); 
  return str;
}
function checkIfEmpty(str) {
    if (str?.trim()) { 
      return false;
    }  
  return true;
}

module.exports = {
  checkIfEmpty,
  removerAcentosEspaco,
  readFilePath,
  createDir,
  fileExtension,
  fileName,
  genareteFileName,
  getFilePath,
  deleteFile,
  getFileFormat,
  getFileSizeInBytes
};
