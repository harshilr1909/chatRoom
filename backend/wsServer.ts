import { WebSocket,WebSocketServer } from "ws";
import http from 'http';

const setupWebSocket = (server:http.Server) =>{
    const wss = new WebSocketServer({server});
    wss.on('connection',(ws:WebSocket) => {
	ws.on('message',(data:any) => {
	    wss.clients.forEach((client) => {
		if(client.readyState === WebSocket.OPEN){
		    client.send(data.toString());
		}
	    });
	});

	ws.on('close',() => console.log("client disconnected"));
    });
    return wss;
}

export default setupWebSocket;
