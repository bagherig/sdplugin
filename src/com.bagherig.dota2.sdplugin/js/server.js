const WebSocket = require('ws');
const GSI = require('dota2-gsi');

class Dota2PluginServer {
    constructor() {
        this.PORT = 4445;
        this.wss = new WebSocket.Server({ port: this.PORT });
        this.gsi = new GSI({ port: 4444 });
        this.setEvents();
    }

    setEvents() {
        this.gsi.events.on('newclient', (client) => {
            console.log('New client connected:', client.ip);
            client.on('map:clock_time', clockTime => this.sendToFrontend({ clockTime }));
            client.on('player:gpm', gpm => this.sendToFrontend({ gpm }));
            client.on('player:xpm', xpm => this.sendToFrontend({ xpm }));
        });

        this.wss.on('connection', (ws) => {
            console.log('WebSocket client connected');

            ws.on('message', (message) => {
                console.log(message);
                if (message === 'startGSI') {
                    console.log('gsi')
                    // Initialize the GSI listener here
                }
            });
        });
    }

    sendToFrontend(data) {
        this.wss.clients.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        });
    }
}

const dota2PluginServer = new Dota2PluginServer();
console.log(`WebSocket server is running on port ${dota2PluginServer.PORT}`);
