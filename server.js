import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;
const bodyParser = require('body-parser')

app.get('/login', async (req, res) =>{
    try{
        const {email, pass} = req.body;

        if(!email || !pass) return res.send("Os campos são obrigatórios");
    }catch{
        
    }

})


app.listen(PORT, ()=>{
    console.log("A aplicação está rodando")
}) 
