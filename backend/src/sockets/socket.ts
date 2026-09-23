import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (server: any) => {

    io = new Server(server, {

        cors: {

            origin: "*",

            methods: ["GET", "POST"]

        }

    });

    return io;

};

export const getIO = () => io;