import dotenv from "dotenv";
import Koa from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import mongoose from "mongoose";
import cors from "koa-cors";
import koaBody from "koa-body";
import api from "./api";
import jwtMiddleware from "./lib/jwtMiddleware";
import socket from "socket.io";
import http from "http";
dotenv.config();

const { SERVER_PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((e) => {
    console.log("????????????~");
    console.error(e);
  });

const app = new Koa();

app.use(koaBody({ multipart: true }));
app.use(cors());
const router = new Router();

router.use("/api", api.routes());
app.use(bodyparser());
app.use(jwtMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = socket(server);
io.on("connection", (socket) => {
  socket.emit("your id", socket.id);
  socket.on("send message", (body) => {
    io.emit("message", body);
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`server is running on port chat: ${SERVER_PORT}`);
});
