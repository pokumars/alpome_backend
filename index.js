const app = require('./app');

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//"This below can be deleted" ~ Oheneba
//const http = require('http');
//const server = http.createServer(app);
/*server.listen(PORT,() => {
  console.log(`server is running on port ${PORT}`);
});*/