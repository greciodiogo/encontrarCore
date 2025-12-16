const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
require("dayjs/locale/pt");
dayjs.locale("pt");

function format(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
  }
  return null;
}

function formatDate(value) {
  if (dayjs(value, 'DD-MM-YYYY').isValid()) {
    return dayjs(value, "DD-MM-YYYY").format("YYYY-MM-DD");
  }
  return null
}

function formatDateToDatabase(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
  }
  return null
}

function formatDateToSaveInDatabase(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).toDate();
  }
  return null
}

function formatPT(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).format("DD-MM-YYYY");
  }
  return null
}

function formatDateToYearAndMonth(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).format("YYYY-MM");
  }
  return null
}

function formatDateToYear(value) {
  if (dayjs(value).isValid()) {
    return dayjs(value).format("YYYY");
  }
  return null
}

module.exports = {
  formatDateTime: format,
  date: formatDate,
  formatDateToDatabase: formatDateToDatabase,
  formatDateToSaveInDatabase: formatDateToSaveInDatabase,
  formatPT: formatPT,
  formatDateToYearAndMonth: formatDateToYearAndMonth,
  formatDateToYear: formatDateToYear
};
