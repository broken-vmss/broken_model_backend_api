console.log("<===== BEGINING =====>");
import http from "http";
import path from "path";
import express from "express";
import socketIO from "socket.io";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});

import _log from "./_log";
import DEF from "./_global";

import API from './api/api';
import { SocketReservedEventsMap } from "socket.io/dist/socket";

const exp: express.Application = express();
const server: http.Server = http.createServer(exp); //for socket.io
const io: socketIO.Server = new socketIO.Server(server);
const ws_ns: socketIO.Namespace = io.of("/");

exp.set("port", parseInt(process.env.HTTP_PORT!) || 3000);

DEF.EXP = exp;
DEF.WS = ws_ns;
//DEF.REDIS

exp.use(express.json());
// APIs
// exp.use(express.static(path.join(_dirname, 'public')));

// CORS
exp.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// TCP_SERVER_LISTEN();
// UDP_SERVER_LISTEN();
API.init();

server.listen(exp.get('port'), function(){
    _log("HTTP RUNNING ON : http://localhost:%s", exp.get('port'));
});


export default exp;