import { WebSocket, WebSocketServer } from "ws";
import http from 'http';

const onlineUsers = new Map<string, WebSocket>();

export function sendToUser(username: string, data: object) {
    const ws = onlineUsers.get(username);
    if(ws && ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify(data));
    }
}

const setupWebSocket = (server: http.Server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        let identifiedUser: string | null = null;

        ws.on('message', (data: any) => {
            let parsed;
            try {
                parsed = JSON.parse(data.toString());
            } catch {
                return;
            }

            if(parsed.type === "identify"){
                identifiedUser = parsed.username;
                onlineUsers.set(identifiedUser, ws);
                console.log(`User identified: ${identifiedUser}`);
                return;
            }

            if(parsed.type === "message" && identifiedUser){
                sendToUser(parsed.receiver, {
                    type: "message",
                    sender: identifiedUser,
                    receiver: parsed.receiver,
                    text: parsed.text,
                    timestamp: parsed.timestamp
                });
                return;
            }
        });

        ws.on('close', () => {
            if(identifiedUser){
                onlineUsers.delete(identifiedUser);
                console.log(`User disconnected: ${identifiedUser}`);
            }
        });
    });

    return wss;
}

export default setupWebSocket;
