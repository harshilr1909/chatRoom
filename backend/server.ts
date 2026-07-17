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

const app = express();
const server = http.createServer(app);
const wss = setupWebSocket(server);
const port = 3001;
const cookieOptions = {
    name:'session',
    secret:'Itsasupersecretkey',
    httpOnly:true,
    maxAge:  (7*24*60*60*1000)
}

app.use(cors({origin:"http://localhost:5173" ,credentials:true}));
app.use(express.json());
app.use(cookieSession(cookieOptions));

con.connect((err,result) => {
    if(err){
	throw err;
    }else{
	console.log("connected:",result);
    }
});


app.use('/new',signInRoute);
app.use('/new/login',logInRoute);
app.use('/new/messages',MessageRoute);
app.use('/new/users',UsersRoute);
app.use('/new/friends',FriendRoute);

app.get('/',(req,res) => {
    res.send("Backend working");
});

server.listen(port,()=>{
    console.log(`server listening through port ${port}`);
});
