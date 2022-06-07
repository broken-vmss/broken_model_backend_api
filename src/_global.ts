import express      from "express";
import socketIO     from "socket.io";

interface DEFI {
    API_VERSION: string,
    REDIS: any,
    WS: socketIO.Namespace|null,
    EXP: express.Application|null,
}

const DEF: DEFI = {
    API_VERSION: "v1",
    REDIS: null,
    WS: null,
    EXP: null
}


export const getAPIPath = (path: string) => "/api/" + DEF.API_VERSION + "/" + (path.length?path:"default");


export default DEF;