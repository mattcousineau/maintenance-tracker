//note to self - this shares Next.js underlying server
import { writeFile } from "fs";
import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
//when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("clt-msg", (value) => {
      console.log(`[TEST]`, value);
      io.emit("chatupdate", value);
    });

    socket.on("upload", (file, callback) => {
      console.log(file); // <Buffer 25 50 44 ...>
      io.emit("chatupdate", "User has uploaded a file...");
      // save the content to the disk, for example
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`>Ready on http://${hostname}:${port}`);
    });
});
