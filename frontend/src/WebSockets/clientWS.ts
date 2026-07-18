export interface WsCallbacks {
    onMessage: (data: { sender: string; receiver: string; text: string; timestamp: string }) => void;
    onFriendRequest?: (data: { sender: string; receiver: string; requestId: number }) => void;
    onFriendAccepted?: (data: { sender: string; receiver: string }) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (err: Event) => void;
}

let socket: WebSocket | null = null;

export function connectWebSocket(username: string, callbacks: WsCallbacks): WebSocket {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${wsProtocol}//${window.location.host}`);

    socket.onopen = () => {
        socket?.send(JSON.stringify({ type: "identify", username }));
        callbacks.onOpen?.();
    };

    socket.onmessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            if(data.type === "message"){
                callbacks.onMessage(data);
            } else if(data.type === "friend_request"){
                callbacks.onFriendRequest?.(data);
            } else if(data.type === "friend_accepted"){
                callbacks.onFriendAccepted?.(data);
            }
        } catch { /* ignore malformed messages */ }
    };

    socket.onclose = () => callbacks.onClose?.();
    socket.onerror = (err) => callbacks.onError?.(err);

    return socket;
}

export function sendDirectMessage(receiver: string, text: string, sender: string) {
    if(!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
        type: "message",
        sender,
        receiver,
        text,
        timestamp: Date.now().toString()
    }));
}

export function sendFriendRequest(receiver: string, sender: string) {
    if(!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
        type: "friend_request",
        sender,
        receiver
    }));
}

export function sendFriendAccepted(sender: string, receiver: string) {
    if(!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
        type: "friend_accepted",
        sender,
        receiver
    }));
}

export function closeWebSocket() {
    if(socket){
        socket.close();
        socket = null;
    }
}
