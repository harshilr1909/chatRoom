import { useRef, useEffect, useState, useCallback } from 'react';
import { connectWebSocket, sendDirectMessage, closeWebSocket } from '../WebSockets/clientWS.ts';

interface Message {
    sender: string;
    receiver: string;
    text: string;
    timestamp: string;
}

interface FriendRequest {
    id: number;
    sender: string;
    receiver: string;
    status: string;
    created_at: string;
}

type SidebarTab = 'friends' | 'requests';

const ChatBox = ({ userName, setSignedIn, setLoggedIn }: { userName: string; setSignedIn: (val: boolean) => void; setLoggedIn: (val: boolean) => void }) => {
    const socket = useRef<WebSocket | null>(null);
    const [friends, setFriends] = useState<string[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [activeTab, setActiveTab] = useState<SidebarTab>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [msg, setMsg] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        closeWebSocket();
        try {
            await fetch('/new/login/session', { 
                method: 'DELETE',
                credentials: 'include'
            });
        } catch {}
        setSignedIn(false);
        setLoggedIn(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleIncomingMessage = useCallback((data: Message) => {
        setMessages(prev => [...prev, data]);
    }, []);

    const handleFriendRequest = useCallback((data: { sender: string; receiver: string; requestId: number }) => {
        setFriendRequests(prev => [...prev, {
            id: data.requestId,
            sender: data.sender,
            receiver: data.receiver,
            status: 'pending',
            created_at: new Date().toISOString()
        }]);
    }, []);

    const handleFriendAccepted = useCallback((data: { sender: string; receiver: string }) => {
        const newFriend = data.sender === userName ? data.receiver : data.sender;
        setFriends(prev => prev.includes(newFriend) ? prev : [...prev, newFriend]);
    }, [userName]);

    useEffect(() => {
        socket.current = connectWebSocket(userName, {
            onMessage: handleIncomingMessage,
            onFriendRequest: handleFriendRequest,
            onFriendAccepted: handleFriendAccepted,
            onOpen: () => console.log("WebSocket connected"),
            onClose: () => console.log("WebSocket disconnected"),
        });

        return () => {
            closeWebSocket();
        };
    }, [userName, handleIncomingMessage, handleFriendRequest, handleFriendAccepted]);

    const fetchFriends = async () => {
        try {
            const res = await fetch('/new/friends');
            const data = await res.json();
            setFriends(data.friends || []);
        } catch (err) {
            console.error("Failed to fetch friends:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const [friendsRes, requestsRes] = await Promise.all([
                    fetch('/new/friends'),
                    fetch('/new/friends/requests')
                ]);
                const friendsData = await friendsRes.json();
                const requestsData = await requestsRes.json();
                setFriends(friendsData.friends || []);
                setFriendRequests(requestsData.requests || []);
            } catch (err) {
                console.error("Failed to initialize:", err);
            }
        };
        init();
    }, []);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/new/users/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data.users || []);
        } catch (err) {
            console.error("Failed to search users:", err);
        }
    };

    const handleAddFriend = async (receiver: string) => {
        try {
            const res = await fetch('/new/friends/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver })
            });
            const data = await res.json();
            if(res.ok){
                setSearchResults(prev => prev.filter(u => u !== receiver));
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Failed to send friend request:", err);
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        try {
            const res = await fetch(`/new/friends/accept/${requestId}`, {
                method: 'POST'
            });
            if(res.ok){
                setFriendRequests(prev => prev.filter(r => r.id !== requestId));
                fetchFriends();
            }
        } catch (err) {
            console.error("Failed to accept friend request:", err);
        }
    };

    const loadConversation = async (otherUser: string) => {
        setSelectedUser(otherUser);
        setIsSearching(false);
        setSearchQuery('');
        setSearchResults([]);
        try {
            const res = await fetch(`/new/messages/${userName}/${otherUser}`);
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim() || !selectedUser) return;

        const timestamp = Date.now().toString();
        const newMessage: Message = {
            sender: userName,
            receiver: selectedUser,
            text: msg,
            timestamp
        };

        sendDirectMessage(selectedUser, msg, userName);

        try {
            await fetch('/new/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msg, userName, receiver: selectedUser })
            });
        } catch (err) {
            console.error("Failed to persist message:", err);
        }

        setMessages(prev => [...prev, newMessage]);
        setMsg('');
    };

    return (
        <div className="chatbox-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Messages</h2>
                    <button className="nav-logout" onClick={handleLogout}>Logout</button>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'friends' ? 'sidebar-tab-active' : ''}`}
                        onClick={() => { setActiveTab('friends'); setIsSearching(false); setSearchQuery(''); setSearchResults([]); }}
                    >
                        Friends
                    </button>
                    <button
                        className={`sidebar-tab ${activeTab === 'requests' ? 'sidebar-tab-active' : ''}`}
                        onClick={() => { setActiveTab('requests'); setIsSearching(false); setSearchQuery(''); setSearchResults([]); }}
                    >
                        Requests {friendRequests.length > 0 && <span className="request-badge">{friendRequests.length}</span>}
                    </button>
                </div>

                <div className="user-list">
                    {isSearching ? (
                        searchResults.length === 0 ? (
                            <p className="no-users">No users found</p>
                        ) : (
                            searchResults.map((user) => (
                                <div key={user} className="user-item">
                                    <div className="user-avatar">{user.charAt(0).toUpperCase()}</div>
                                    <span className="user-name">{user}</span>
                                    <button
                                        className="add-friend-button"
                                        onClick={() => handleAddFriend(user)}
                                    >
                                        Add Friend
                                    </button>
                                </div>
                            ))
                        )
                    ) : activeTab === 'friends' ? (
                        friends.length === 0 ? (
                            <p className="no-users">No friends yet. Search to add some!</p>
                        ) : (
                            friends.map((user) => (
                                <div
                                    key={user}
                                    className={`user-item ${selectedUser === user ? 'user-item-active' : ''}`}
                                    onClick={() => loadConversation(user)}
                                >
                                    <div className="user-avatar">{user.charAt(0).toUpperCase()}</div>
                                    <span className="user-name">{user}</span>
                                </div>
                            ))
                        )
                    ) : (
                        friendRequests.length === 0 ? (
                            <p className="no-users">No pending requests</p>
                        ) : (
                            friendRequests.map((request) => (
                                <div key={request.id} className="user-item">
                                    <div className="user-avatar">{request.sender.charAt(0).toUpperCase()}</div>
                                    <span className="user-name">{request.sender}</span>
                                    <button
                                        className="accept-button"
                                        onClick={() => handleAcceptRequest(request.id)}
                                    >
                                        Accept
                                    </button>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            <div className="chat-area">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-header-avatar">{selectedUser.charAt(0).toUpperCase()}</div>
                            <span className="chat-header-name">{selectedUser}</span>
                        </div>
                        <div className="messages-container">
                            {messages.length === 0 && (
                                <p className="no-messages">No messages yet. Start the conversation!</p>
                            )}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message-bubble ${message.sender === userName ? 'message-sent' : 'message-received'}`}
                                >
                                    <p className="message-text">{message.text}</p>
                                    <span className="message-time">
                                        {new Date(Number(message.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="message-form" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="message-input"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                            />
                            <button type="submit" className="send-button">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Select a friend to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatBox;
