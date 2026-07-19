import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import signInRoute from './routes/signInRoute.ts';
import logInRoute from './routes/logInRoute.ts';
import MessageRoute from './routes/MessageRoute.ts';
import UsersRoute from './routes/UsersRoute.ts';
import FriendRoute from './routes/FriendRoute.ts';
import con from './middlewares/connectToDB.ts';
import setupWebSocket from './wsServer.ts';
import http from 'http';
import cookieSession from 'cookie-session';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();
const server = http.createServer(app);
const wss = setupWebSocket(server);
const port = Number(process.env.PORT) || 3001;
const cookieOptions = {
    name: 'session',
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Railway (and most PaaS) terminate TLS at the proxy; needed for secure cookies
if (isProd) {
    app.set('trust proxy', 1);
}

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieSession(cookieOptions));

con.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        console.error(
            'Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, and set DB_SSL=true for Aiven/managed MySQL.'
        );
        return;
    }
    console.log('MySQL connected');
});

app.use('/new', signInRoute);
app.use('/new/login', logInRoute);
app.use('/new/messages', MessageRoute);
app.use('/new/users', UsersRoute);
app.use('/new/friends', FriendRoute);

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(port, '0.0.0.0', () => {
    console.log(`server listening through port ${port}`);
});
