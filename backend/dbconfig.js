import { MongoClient } from "mongodb";

const url = process.env.MONGO_URL;
const dbName="node-project";
export const collectionName = "todo";
const client = new MongoClient(url)
export const connection=async()=>{
    const connect = await client.connect();
    return await connect.db(dbName)
}

