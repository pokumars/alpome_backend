const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors);


app.get('/api', (request, response, next) => {
  response.send('we have lift off');
});

const PORT = 3002;
app.listen(PORT,() => {
  console.log(`server is running on port ${PORT}`);
});