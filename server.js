const express = require('express');
const routes = require('./routes/index');

const server = express();
const PORT = process.env.PORT || 5000;

server.use(express.json());
server.use('/', routes);

server.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
