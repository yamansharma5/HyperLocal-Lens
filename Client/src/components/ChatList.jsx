import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import ChatWindow from './ChatWindow';
import {
    MessageSquare, Loader2, User, Store, Trash2,
} from 'lucide-react';

function ChatList() {
    const { user } = useAuth();
    const { socket, joinUserRoom } = useSocket();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchChats = useCallback(async () => {
        try {
            const res = await api.get('/chat/my');
            setChats(res.data.chats || []);
        } catch (err) {
            console.error('Failed to fetch chats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    // Join user room for chat notifications
    useEffect(() => {
        if (user?._id) joinUserRoom(user._id);
    }, [user, joinUserRoom]);

    // Listen for chat updates (new messages in any chat)
    useEffect(() => {
        if (!socket) return;

        const handleChatUpdated = (data) => {
            setChats((prev) =>
                prev.map((c) => {
                    if (c._id === data.chatId) {
                        return {
                            ...c,
                            lastMessage: data.lastMessage,
                            updatedAt: new Date().toISOString(),
                            _unread: data.unreadCount,
                        };
                    }
                    return c;
                }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            );
        };

        socket.on('chatUpdated', handleChatUpdated);
        return () => socket.off('chatUpdated', handleChatUpdated);
    }, [socket]);

    const getOther = (chat) => chat.participants?.find((p) => p._id !== user._id);

    // Role-based display name:
    // - If logged-in user is "user" → show Business shopName
    // - If logged-in user is "business" → show Customer name
    const getChatName = (chat) => {
        if (user?.role === 'business') {
            const other = getOther(chat);
            return other?.name || 'Customer';
        }
        return chat.business?.shopName || getOther(chat)?.name || 'Chat';
    };

    const getChatIcon = (chat) => {
        if (user?.role === 'business') return 'user';
        return 'store';
    };

    const getUnread = (chat) => {
        if (chat._unread !== undefined) return chat._unread;
        if (!chat.unreadCount || !user?._id) return 0;
        return chat.unreadCount[user._id] || 0;
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        const yest = new Date(now);
        yest.setDate(yest.getDate() - 1);
        if (d.toDateString() === yest.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const totalUnread = chats.reduce((sum, c) => sum + getUnread(c), 0);

    if (loading) {
        return (
            <div className="glass-card p-8 text-center">
                <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
                <p className="text-dark-400 text-sm mt-3">Loading messages...</p>
            </div>
        );
    }

    return (
        <>
            <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary-400" />
                        Messages
                    </h2>
                    {totalUnread > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold animate-pulse">
                            {totalUnread} new
                        </span>
                    )}
                </div>

                {chats.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare className="w-10 h-10 text-dark-600 mx-auto mb-3" />
                        <p className="text-dark-400 text-sm font-medium">No messages yet</p>
                        <p className="text-dark-500 text-xs mt-1">
                            {user?.role === 'business'
                                ? 'Customers will contact you here'
                                : 'Tap "Contact Business" on a broadcast to start chatting'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {chats.map((chat) => {
                            const other = getOther(chat);
                            const unread = getUnread(chat);
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`group/chat w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all text-left ${unread > 0 ? 'bg-primary-500/5' : ''}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-11 h-11 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center">
                                            {getChatIcon(chat) === 'store'
                                                ? <Store className="w-5 h-5 text-dark-400" />
                                                : <User className="w-5 h-5 text-dark-400" />}
                                        </div>
                                        {unread > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                {unread > 9 ? '9+' : unread}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-sm truncate ${unread > 0 ? 'font-bold text-white' : 'font-medium text-dark-200'}`}>
                                                {getChatName(chat)}
                                            </p>
                                            <span className="text-[10px] text-dark-500 shrink-0 ml-2">
                                                {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {user?.role === 'business' && chat.business && (
                                                <span className="text-[10px] text-dark-500 shrink-0">[{chat.business.shopName}]</span>
                                            )}
                                            <p className={`text-xs truncate ${unread > 0 ? 'text-dark-300' : 'text-dark-500'}`}>
                                                {chat.lastMessage?.text || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!confirm('Delete this conversation? All messages will be removed.')) return;
                                            setDeletingId(chat._id);
                                            api.delete(`/chat/${chat._id}`)
                                                .then(() => setChats((prev) => prev.filter((c) => c._id !== chat._id)))
                                                .catch((err) => console.error('Delete failed:', err))
                                                .finally(() => setDeletingId(null));
                                        }}
                                        disabled={deletingId === chat._id}
                                        className="p-2 rounded-lg text-dark-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 opacity-0 group-hover/chat:opacity-100"
                                        title="Delete chat"
                                    >
                                        {deletingId === chat._id
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedChat && (
                <ChatWindow
                    chat={selectedChat}
                    onClose={() => {
                        setSelectedChat(null);
                        fetchChats();
                    }}
                />
            )}
        </>
    );
}

export default ChatList;
