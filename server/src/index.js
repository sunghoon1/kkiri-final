import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'koa-cors';
import koaBody from 'koa-body';

import http from 'http';
import socketIO from 'socket.io';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';
import Room from './models/room';

dotenv.config();

const { MONGODB_URI, MONGODB_USER, MONGODB_PASS, SERVER_PORT } = process.env;

const authData = {
  user: MONGODB_USER,
  pass: MONGODB_PASS,
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose
  .connect(MONGODB_URI, authData)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
const router = new Router();
const socketRouter = new Router();

// Socket.io app 인스턴스 생성
app.server = http.createServer(app.callback());
app.io = socketIO(app.server, {});

app.io
  .use((socket, next) => {
    let error = null;

    try {
      let ctx = app.createContext(socket.request, new http.OutgoingMessage());
      socket.cookies = ctx.cookies;
    } catch (err) {
      error = err;
      console.log(error);
    }
    return next(error);
  })
  .on('connection', function (socket) {
    const token = socket.cookies.get('access_token');
    if (!token) return; // 토큰이 없음

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (app.io.sockets.adapter.rooms.has(decoded.coupleShareCode)) {
      socket.join(decoded.coupleShareCode);
    } else {
      const createRoomId = decoded.coupleShareCode;
      socket.join(createRoomId);
    }
    socket.on('disconnect', () => {
      socket.leave(decoded.coupleShareCode);
    });

    // 방 입장
    socket.on('joinRoom', (coupleShareCode) => {
      socket.join(coupleShareCode);
    });

    // 메시지 전송
    socket.on('send message', async (messageObj) => {
      app.io.to(messageObj.coupleShareCode).emit('message', messageObj);

      try {
        const room = await Room.findCoupleCode(messageObj.coupleShareCode);
        await room.pushMessageData(messageObj);
        room.save();
      } catch (e) {
        console.log(e);
      }
    });

    // 알림에 쓰일것
    socket.on('new message', (coupleId) => {
      app.io.to(decoded.coupleShareCode).emit('notification', coupleId);
    });
  });

// 라우터 설정
router.use('/api', api.routes()); // api 라우트 적용
router.use('/', socketRouter.routes());
// 라우터 적용 전에 bodyParser 적용
app.use(koaBody({ multipart: true }));
app.use(cors());

app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// 소켓 적용, app.listen 오버라이드
app.listen = (...args) => {
  app.server.listen.call(app.server, ...args);
  return app.server;
};

// PORT 가 지정되어있지 않다면 4000 을 사용
const port = SERVER_PORT || 4000;
app.listen(port, () => {
  console.log(`server is running on port chat: ${port}`);
});
