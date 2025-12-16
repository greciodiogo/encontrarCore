function convertFromBytes(bytes,decimalLength) {
  if(bytes == 0) return '0 Bytes';
  var k = 1000,
      dm = decimalLength || 0,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
      const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
      // const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  return {
    bytes: size,
    unit: sizes[i]
  }
}


module.exports = {
  convertFromBytes
};
