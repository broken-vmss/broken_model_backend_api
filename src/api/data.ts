import { Pool, PoolClient } from 'pg';
import {Request, Response} from "express";
import DEF, { getAPIPath } from "../_global";




let db_client: PoolClient|null= null;

const connect = async ()=>{
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
    });

    let err = null;
    db_client = await pool.connect().catch(e => err = e);

    if(err){
        console.warn("database connection error",err);
    }

    else {
        console.log("database connected");
    }
}

export const create_table = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let command = `create table if not exists ${data.name}(${data.props
        .map((x: { name: any; type: any; }) => `${x.name} ${x.type}`).join(",")})`;
    await db_client.query(command);
    res.send("table created");
}

export const create_database = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let command = `create database if not exists ${data.name}`;
    await db_client.query(command);
    res.send("database created");
}

export const show_tables = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let command = `USE ${data.name}; SHOW TABLES`;
}

export const read = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let columns = data.columns.join(",");
    let where = data.where.join(" and ");

    let command = `select ${columns} from ${data.name} where ${where}`;
    let result = await db_client.query(command);
    res.send(result.rows);
}

export const update = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let updates = data.columns.join(",");
    let where = data.where.join(" and ");

    let command = `update ${data.name} set ${updates} where ${where}`;
    let result = await db_client.query(command);
    res.send(result.rows);
}

export const delete_ = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let where = data.where.join(" and ");

    let command = `delete from ${data.name} where ${where}`;
    let result = await db_client.query(command);
    res.send(result.rows);
}

export const delete_all = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let command = `delete from ${data.name}`;
    let result = await db_client.query(command);
    res.send(result.rows);

}

export const insert = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let columns = data.columns.join(",");
    let values = data.values.join(",");

    let command = `insert into ${req.body.data.name} (${columns}) values (${values})`;
    let result = await db_client.query(command);
    res.send(result.rows);
}

export const store_model = async (req:Request, res:Response) => {
    if (!db_client) {
        console.warn("database connection error");
        return res.send({success: false, errors: ["internal error: not connected to DB"]});
    }
    
    
    let data = req.body?.data;
    if (!data) {
        res.status(400).send("No data");
        return;
    }
    let model = JSON.stringify(data);
    let command = `insert into models(name, model) values ('${data.name}', '${model}')`;
    let result = await db_client.query(command);
    res.send("model stored");
}



const init = () => {
    if (!DEF.EXP) return;
    connect();
    DEF.EXP.post(getAPIPath("create_table"), create_table, store_model);
    DEF.EXP.post(getAPIPath("create_database"), create_database);
    DEF.EXP.get(getAPIPath("show_tables"), show_tables);
    DEF.EXP.get(getAPIPath("read"), read);
    DEF.EXP.post(getAPIPath("update"), update);
    DEF.EXP.post(getAPIPath("delete_"), delete_);
    DEF.EXP.post(getAPIPath("delete_all"), delete_all);
    DEF.EXP.post(getAPIPath("insert"), insert);
}

export default init;