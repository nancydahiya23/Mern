import express from 'express';
import cors from 'cors';
import { collectionName, connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app= express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(cookieParser())

app.post("/signup",async(req,res)=>{
    const userData = req.body;
    if(userData.name && userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users');
        const result = await collection.insertOne(userData);
        if(result) {
    jwt.sign(userData,'Google',{expiresIn:'5d'},(error,token)=>{
        res.cookie('token', token, {
  httpOnly: true,
  secure: false, // true if using HTTPS
  sameSite: 'Lax', // or 'None' if cross-origin
});

        res.send({success:true,msg:'signup done',token})
    })
}
}else {
    res.send({
        success:false,
        msg: 'signup not done',
    })
}
})

app.post("/login",async(req,res)=>{
    const userData = req.body;
    if(userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users');
        const result = await collection.findOne({email:userData.email,password:userData.password});
        if(result) {
    jwt.sign(userData,'Google',{expiresIn:'5d'},(error,token)=>{
        res.cookie('token', token, {
  httpOnly: true,
  secure: false, // true if using HTTPS
  sameSite: 'Lax', // or 'None' if cross-origin
});

        res.send({success:true,msg:'login done',token})
    })
}else{
     res.send({
        success:false,
        msg: 'user not found',
    })
}
}else {
    res.send({
        success:false,
        msg: 'login not done',
    })
}
})

app.post("/add-task",verifyJWTToken,async(req,res)=>{
    const db = await connection();
    const collection = await db.collection(collectionName)
    const result = await collection.insertOne(req.body)
    if(result){
        res.send({message:"new task added",success:true,result})
    }else{
        res.send({message:"task not added",success:false,result})
    }
})

app.get("/tasks",verifyJWTToken,async(req,res)=>{
    const db = await connection();
    const collection = await db.collection(collectionName)
    const result = await collection.find().toArray();
    if(result){
        res.send({message:"task list fetched",success:true,result})
    }else{
        res.send({message:"task list not fetched",success:false,result})
    }
})


app.delete("/delete/:id",verifyJWTToken,async(req,res)=>{
    const db = await connection();
     const id = req.params.id;
    const collection = await db.collection(collectionName)
    const result = await collection.deleteOne({_id:new ObjectId(id)});
    if(result){
        res.send({message:"task deleted",success:true,result})
    }else{
        res.send({message:"task not deleted",success:false,result})
    }
})

app.get("/task/:id",async(req,res)=>{
    const db = await connection();
     const id = req.params.id;
    const collection = await db.collection(collectionName)
    const result = await collection.findOne({_id:new ObjectId(id)});
    if(result){
        res.send({message:"task fetched",success:true,result})
    }else{
        res.send({message:"task not fetched",success:false,result})
    }
})

app.put("/update-task",async(req,res)=>{
    const db = await connection();
    const collection = await db.collection(collectionName)
    const {_id,...fields}=(req.body)
    const update = {$set:fields}
    const result = await collection.updateOne({_id:new ObjectId(_id)},update);
    if(result){
        res.send({message:"task data updated",success:true,result})
    }else{
        res.send({message:"task data not updated",success:false,result})
    }
})

app.delete("/delete-multi",verifyJWTToken,async(req,res)=>{
    const db = await connection();
     const Ids = req.body;
     const deleteTaskIds = Ids.map((item)=>new ObjectId(item))
     console.log(Ids)
    const collection = await db.collection(collectionName)
    const result = await collection.deleteMany({_id:{$in:deleteTaskIds}});
    if(result){
        res.send({message:"task deleted",success:result})
    }else{
        res.send({message:"task not deleted",success:result})
    }
})

function verifyJWTToken(req,res,next) {
    const token = req.cookies['token'];
    jwt.verify(token,'Google',(error,decoded)=>{
        if(error){
            return res.send({
                msg:"invalid token",
                success:false
            })
        } else{
            next()
        }
        
    })
    
}



app.listen(3200)