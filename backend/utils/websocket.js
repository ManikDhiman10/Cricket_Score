const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

module.exports = {
  emitUpdate: (match) => {
    const data = JSON.stringify(match);
    clients.forEach(client => client.send(data));
  },
  setup: (server) => {
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
  },
};
