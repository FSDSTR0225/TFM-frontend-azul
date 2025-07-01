import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
  //io es similar a fetch pero para websockets,lo conectamos al backend
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000, // hace que no se conecte automáticamente al cargar la app porque no queremos que se conecte hasta que el usuario inicie sesión
  // transports: ["websocket"], // especifica que queremos usar websockets como transporte
});

socket.on("connect", () => {
  console.log("✅ Socket conectado:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket desconectado");
});

//con esto podemos conectar el socket desde cualquier parte de la app usando socket.emit("nombre del evento", data) para enviar datos al backend
// y para escuchar algo socket.on("nombre del evento", (datos)=> { para tratar los datos recibidos})
