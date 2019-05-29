import http from "http";
import querystring from "querystring";
import url from "url";
import fs from "fs";
import path from 'path';
import WebSocket from "ws";

import { SERVER_PORT, WEBSOCKET_SERVER_PORT } from "./constants";

const wss = new WebSocket.Server({port: WEBSOCKET_SERVER_PORT});

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log(`recieved: ${message}`);
    ws.send(message);
  });
});

const server = http.createServer((req, res) => {
  const data = querystring.parse(url.parse(req.url).query);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");

  if (data.title && data.text) {
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  res.end(fs.readFileSync(path.join(__dirname, 'public', 'index.html')));
});


server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}`);
});

export default server;
