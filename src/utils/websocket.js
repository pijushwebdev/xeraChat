// websocket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:9000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

export default socket;
