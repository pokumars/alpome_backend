const app = require('./app');
const config= require('./utils/config');


app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});


//"This below can be deleted" ~ Oheneba
//const http = require('http');
//const server = http.createServer(app);
/*server.listen(PORT,() => {
  console.log(`server is running on port ${PORT}`);
});*/