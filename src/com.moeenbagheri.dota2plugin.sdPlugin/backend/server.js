const WebSocket = require('ws');
const GSI = require('dota2-gsi');

const PORT = 8084;
const wss = new WebSocket.Server({ port: PORT });
const gsi = new GSI({ port: 3000 });

function sendToFrontend(data) {
    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    });
}

gsi.events.on('newclient', (client) => {
    console.log('New client connected:', client.ip);

    // client.on('newdata', newdata => console.log(newdata));
    client.on('map:clock_time', clockTime => sendToFrontend({ clockTime }));
    client.on('player:gpm', gpm => sendToFrontend({ gpm }));
    client.on('player:xpm', xpm => sendToFrontend({ xpm }));
});

wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
});

console.log(`WebSocket server is running on port ${PORT}`);
