import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import {
    X, Send, MessageSquare, Loader2, Store, User, ArrowLeft,
} from 'lucide-react';

// Pre-filled quick message suggestions
const QUICK_MESSAGES = [
    'Can you share more about this?',
    'Is this offer still available?',
    'What are your opening hours?',
    'Do you offer home delivery?',
    'Can I get more details?',
];

function ChatWindow({ chat, businessId, businessName, broadcastText, onClose }) {
    const { user } = useAuth();
    const { socket, joinChat, leaveChat, emitTyping, emitStopTyping } = useSocket();

    const [currentChat, setCurrentChat] = useState(chat || null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const [showQuickMsgs, setShowQuickMsgs] = useState(true);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Init chat
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                if (chat) {
                    setCurrentChat(chat);
                } else if (businessId) {
                    const res = await api.post('/chat/start', { businessId });
                    setCurrentChat(res.data.chat);
                }
            } catch (err) {
                console.error('Failed to init chat:', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [businessId, chat]);

    // Load messages
    useEffect(() => {
        if (!currentChat?._id) return;
        const load = async () => {
            try {
                const res = await api.get(`/chat/${currentChat._id}/messages`);
                setMessages(res.data.messages || []);
                // If there are already messages, hide quick suggestions
                if (res.data.messages?.length > 0) setShowQuickMsgs(false);
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };
        load();
        api.put(`/chat/${currentChat._id}/read`).catch(() => { });
    }, [currentChat?._id]);

    // Join socket room
    useEffect(() => {
        if (!currentChat?._id) return;
        joinChat(currentChat._id);
        return () => leaveChat(currentChat._id);
    }, [currentChat?._id, joinChat, leaveChat]);

    // Listen for real-time messages
    useEffect(() => {
        if (!socket || !currentChat?._id) return;

        const onNewMessage = (data) => {
            if (data.chatId === currentChat._id) {
                setMessages((prev) => {
                    if (prev.some((m) => m._id === data.message._id)) return prev;
                    return [...prev, data.message];
                });
                setShowQuickMsgs(false);
                api.put(`/chat/${currentChat._id}/read`).catch(() => { });
            }
        };

        const onTyping = (data) => {
            if (data.chatId === currentChat._id) setTypingUser(data.userName);
        };

        const onStopTyping = (data) => {
            if (data.chatId === currentChat._id) setTypingUser(null);
        };

        socket.on('newMessage', onNewMessage);
        socket.on('userTyping', onTyping);
        socket.on('userStoppedTyping', onStopTyping);

        return () => {
            socket.off('newMessage', onNewMessage);
            socket.off('userTyping', onTyping);
            socket.off('userStoppedTyping', onStopTyping);
        };
    }, [socket, currentChat?._id]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUser]);

    // Send message
    const handleSend = async (e) => {
        e?.preventDefault();
        if (!newMsg.trim() || !currentChat?._id || sending) return;

        setSending(true);
        const msgText = newMsg.trim();
        setNewMsg('');
        setShowQuickMsgs(false);
        emitStopTyping(currentChat._id);

        try {
            const res = await api.post('/chat/send', { chatId: currentChat._id, text: msgText });
            setMessages((prev) => {
                if (prev.some((m) => m._id === res.data.message._id)) return prev;
                return [...prev, res.data.message];
            });
        } catch (err) {
            console.error('Failed to send:', err);
            setNewMsg(msgText);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    // Quick message click
    const handleQuickMsg = (text) => {
        setNewMsg(text);
        setShowQuickMsgs(false);
        inputRef.current?.focus();
    };

    // Typing indicator
    const handleInputChange = (e) => {
        setNewMsg(e.target.value);
        if (currentChat?._id) {
            emitTyping(currentChat._id, user?.name);
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => emitStopTyping(currentChat._id), 2000);
        }
    };

    // Role-based display name for chat header:
    // - If logged-in user is "user" → show Business shopName
    // - If logged-in user is "business" → show Customer name
    const getChatDisplayName = () => {
        if (user?.role === 'business') {
            const other = currentChat?.participants?.find((p) => p._id !== user._id);
            return other?.name || 'Customer';
        }
        return currentChat?.business?.shopName || businessName || 'Chat';
    };

    const getChatSubtitle = () => {
        if (user?.role === 'business') {
            return currentChat?.business?.shopName
                ? `${currentChat.business.shopName} · ${currentChat.business.category || ''}`
                : '';
        }
        return currentChat?.business?.category || '';
    };

    const isViewingBusiness = user?.role !== 'business';

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        if (d.toDateString() === yest.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Group messages by date
    const grouped = messages.reduce((g, msg) => {
        const date = formatDate(msg.createdAt);
        if (!g[date]) g[date] = [];
        g[date].push(msg);
        return g;
    }, {});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg h-[600px] max-h-[85vh] glass-card flex flex-col overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
                    <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center shrink-0">
                        {isViewingBusiness ? <Store className="w-5 h-5 text-primary-400" /> : <User className="w-5 h-5 text-primary-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">{getChatDisplayName()}</h3>
                        {getChatSubtitle() && (
                            <p className="text-xs text-dark-400 truncate">{getChatSubtitle()}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        </div>
                    ) : messages.length === 0 && !showQuickMsgs ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <MessageSquare className="w-10 h-10 text-dark-600 mb-3" />
                            <p className="text-dark-400 text-sm font-medium">No messages yet</p>
                            <p className="text-dark-500 text-xs mt-1">Send a message to start the conversation</p>
                        </div>
                    ) : (
                        <>
                            {/* Broadcast context */}
                            {broadcastText && messages.length === 0 && (
                                <div className="mb-4 p-3 rounded-xl bg-primary-500/5 border border-primary-500/15">
                                    <p className="text-[10px] text-primary-400 font-semibold mb-1">Regarding broadcast:</p>
                                    <p className="text-xs text-dark-300 italic">"{broadcastText}"</p>
                                </div>
                            )}

                            {/* Quick message suggestions */}
                            {showQuickMsgs && messages.length === 0 && (
                                <div className="mb-4">
                                    <p className="text-xs text-dark-400 mb-3 text-center">Quick messages:</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {QUICK_MESSAGES.map((qm, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleQuickMsg(qm)}
                                                className="px-3 py-1.5 rounded-full bg-dark-800/60 border border-white/10 text-xs text-dark-300 hover:bg-primary-500/10 hover:border-primary-500/30 hover:text-primary-300 transition-all duration-300"
                                            >
                                                {qm}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Object.entries(grouped).map(([date, msgs]) => (
                                <div key={date}>
                                    <div className="flex items-center justify-center my-4">
                                        <span className="px-3 py-1 rounded-full bg-dark-800/80 text-dark-400 text-[10px] font-semibold">{date}</span>
                                    </div>
                                    {msgs.map((msg) => {
                                        const isMe = (msg.senderId?._id || msg.senderId) === user._id;
                                        return (
                                            <div key={msg._id} className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                                    ? 'bg-primary-500/20 text-white rounded-br-md'
                                                    : 'bg-dark-800/60 text-dark-200 rounded-bl-md'
                                                    }`}>
                                                    {!isMe && (
                                                        <p className="text-[10px] font-bold text-primary-400 mb-1">{msg.senderId?.name || 'User'}</p>
                                                    )}
                                                    <p className="break-words">{msg.text}</p>
                                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-300/50' : 'text-dark-500'}`}>
                                                        {formatTime(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {typingUser && (
                                <div className="flex items-center gap-2 px-3 py-2 animate-fade-in">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-xs text-dark-400">{typingUser} is typing...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex items-center gap-3 shrink-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMsg}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        maxLength={2000}
                        className="flex-1 bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!newMsg.trim() || sending}
                        className="p-3 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;
