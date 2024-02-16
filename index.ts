const express = require('express');
const app = express();
const webSocket = require('ws');
const server = require('http').createServer(app);
const path = require('path');
const wss = new webSocket.Server({server});
app.use('/assets', express.static(path.join(__dirname,'/FrontEnd/TTT/dist/assets')))

wss.on('connection', (ws,req) => {
    if(req){
        ws.roomId = req.url;
    }
    console.log("a new connection " + ws.roomId);
    ws.on('message',(message) => {
        const userMsg = JSON.parse(message);
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === webSocket.OPEN && client.roomId === ws.roomId) {
                client.send(JSON.stringify(userMsg));
            }
        });
        console.log(`${message}`);
    });
})

app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, 'FrontEnd','TTT/dist','index.html'));
});

server.listen("4000",() => {
    console.log("server is listening on port 4000");
})