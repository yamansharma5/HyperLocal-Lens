import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Connect to Socket.io server
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });

        newSocket.on('connect', () => {
            console.log('⚡ Socket connected:', newSocket.id);
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.log('🔌 Socket connection error:', err.message);
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const value = {
        socket,
        connected,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
