
const now = new Date();

const currentLocalTime = ()=> {
  return now.toLocaleTimeString('fi-FI');
};

const currentLocalDateTime = ()=> {
  return `--[ ${now} ]--`;
};


//
const deleteSensitiveKeyFromObj = (object, keyToDelete) => {
  delete object[keyToDelete];
  return object;
};

module.exports = { currentLocalTime, currentLocalDateTime, deleteSensitiveKeyFromObj };