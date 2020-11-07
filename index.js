const app = require('./app');
const config= require('./utils/config');
const logger = require('./utils/logger');


app.listen(config.PORT, () => {
  
  logger.info(`Server running on port ${config.PORT}`);
});


//"This below can be deleted" ~ Oheneba
//const http = require('http');
//const server = http.createServer(app);
/*server.listen(PORT,() => {
  logger.info(`server is running on port ${PORT}`);
});*/