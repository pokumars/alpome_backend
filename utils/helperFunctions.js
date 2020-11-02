const now = new Date();

const currentLocalTime = ()=> {
  return now.toLocaleTimeString('fi-FI');
};

const currentLocalDateTime = ()=> {
  return `--[ ${now} ]--`;
};




module.exports = { currentLocalTime, currentLocalDateTime };