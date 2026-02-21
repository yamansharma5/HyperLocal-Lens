import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

    // Chat helpers
    const joinUserRoom = useCallback((userId) => {
        if (socket && userId) socket.emit('joinUserRoom', userId);
    }, [socket]);

    const joinChat = useCallback((chatId) => {
        if (socket && chatId) socket.emit('joinChat', chatId);
    }, [socket]);

    const leaveChat = useCallback((chatId) => {
        if (socket && chatId) socket.emit('leaveChat', chatId);
    }, [socket]);

    const emitTyping = useCallback((chatId, userName) => {
        if (socket) socket.emit('typing', { chatId, userName });
    }, [socket]);

    const emitStopTyping = useCallback((chatId) => {
        if (socket) socket.emit('stopTyping', { chatId });
    }, [socket]);

    const value = {
        socket,
        connected,
        joinUserRoom,
        joinChat,
        leaveChat,
        emitTyping,
        emitStopTyping,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
