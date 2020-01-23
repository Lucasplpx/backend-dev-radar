const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { setupWebsocket } = require('./websocket');

const routes = require('./routes');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

app.use(cors());

mongoose.connect(`mongodb+srv://root:root@cluster0-wicox.mongodb.net/week10?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

app.use(express.json());
app.use(routes);

server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});