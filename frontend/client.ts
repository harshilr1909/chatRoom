const ws = new WebSocket("ws://localhost:3001");
ws.onopen = () => {console.log("connection established")};
ws.onmessage =  (event:MessageEvent) => {console.log("data recieved",event.data)};
ws.onclose = () => {console.log("connection closed")};
ws.onerror= (err) => {console.log("Error found: ",err)};
