import _log from '../_log';
import DEF from '../_global';

import {Request, Response} from 'express';
import { getAPIPath } from '../_global';




const testingAPI = async (req: Request, res: Response) => {

    let a: number = parseInt(req.params.id);
    let b: number = a*a;
    res.send({status: "API WORKING!", result: b});
};

const init = () => {

    if(!DEF.EXP) return;

    _log("API INITIALIZING...");

    DEF.EXP.get(getAPIPath(":id"), testingAPI); //gives "API WORKING!" when ended with /test, http://localhost:3002/api/v1/test


}


export default {
    init:init,
}