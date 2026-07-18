import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import signInRoute from './routes/signInRoute.ts';
import logInRoute from './routes/logInRoute.ts';
import MessageRoute from './routes/MessageRoute.ts';
import UsersRoute from './routes/UsersRoute.ts';
import FriendRoute from './routes/FriendRoute.ts';
import con from './middlewares/connectToDB.ts';
import setupWebSocket from './wsServer.ts';
import http from 'http';
import cookieSession from 'cookie-session';
import path from 'path';

const app = express();
const server = http.createServer(app);
const wss = setupWebSocket(server);
const port = process.env.PORT || 3001;
const cookieOptions = {
    name:'session',
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret',
    httpOnly:true,
    maxAge:  (7*24*60*60*1000)
}

app.use(cors({origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials:true}));
app.use(express.json());
app.use(cookieSession(cookieOptions));

con.connect((err,result) => {
    if(err){
	throw err;
    }else{
	console.log("connected:",result);
    }
});

app.use(express.static(path.join(__dirname,"dist")));

app.use('/new',signInRoute);
app.use('/new/login',logInRoute);
app.use('/new/messages',MessageRoute);
app.use('/new/users',UsersRoute);
app.use('/new/friends',FriendRoute);

app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'dist','index.html'));
});

server.listen(port,()=>{
    console.log(`server listening through port ${port}`);
});
