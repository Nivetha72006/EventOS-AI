import { Server, Socket } from "socket.io";

export const registerSocketHandlers = (io: Server) => {

    io.on("connection", (socket: Socket) => {

        console.log("User Connected:", socket.id);

        socket.on("join", (userId: string) => {

            socket.join(userId);

            console.log(`${userId} joined`);

        });

        socket.on("disconnect", () => {

            console.log("User Disconnected");

        });

    });

};