import http from "http";

import app from "./app";

import { initializeSocket } from "./sockets/socket";

import { registerSocketHandlers } from "./sockets/socket.handler";

const server = http.createServer(app);

const io = initializeSocket(server);

registerSocketHandlers(io);

server.listen(process.env.PORT || 5000, () => {

    console.log("Server running");

});