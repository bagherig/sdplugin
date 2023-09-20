const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;
const IP_ADDRESS = '0.0.0.0';  // Listen on all network interfaces

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// WebSocket setup
const wss = new WebSocket.Server({ port: 8084 });

wss.on('connection', (ws) => {
    console.log('Client connected');
});

// Endpoint to receive data from Dota 2 GSI
app.post('/', (req, res) => {
    console.log(req.body); // Log the game state data
    // TODO: Process the data and send it to the frontend
    res.sendStatus(200); // Send a success response
});

app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running on ${IP_ADDRESS}:${PORT}`);
});

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});
