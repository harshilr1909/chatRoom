import express from 'express';
import cors from 'cors';
import signInRoute from './routes/signInRoute.ts';
import con from './middlewares/connectToDB.ts';
import setupWebSocket from './wsServer.ts';
import http from 'http';
const app = express();
const server = http.createServer(app);
const wss = setupWebSocket(server);
const port = 3001;

app.use(cors());
app.use(express.json());

con.connect((err,result) => {
    if(err){
	throw err;
    }else{
	console.log("connected:",result);
    }
});


app.use('/new',signInRoute);

app.get('/',(req,res) => {
    res.send("Backend working");
});

server.listen(port,()=>{
    console.log(`server listening through port ${port}`);
});
