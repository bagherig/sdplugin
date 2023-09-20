const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8084 });
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to receive data from Dota 2 GSI
app.post('/gsi', (req, res) => {
    console.log(req.body); // Log the game state data
    // TODO: Process the data and send it to the frontend
    res.sendStatus(200); // Send a success response
});

const GSI_PORT = 3000;
app.listen(3000, () => {
    console.log(`Server is running on port ${GSI_PORT}`);
});


wss.on('connection', (ws) => {
    console.log('Client connected');

    // When receiving data from Dota 2 GSI
    app.post('/gsi', (req, res) => {
        console.log(req.body);
        ws.send(JSON.stringify(req.body)); // Send the game state data to the frontend
        res.sendStatus(200);
    });
});
