import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
    MapPin,
    Radio,
    LogOut,
    Menu,
    X,
    Store,
    LayoutDashboard,
    User,
    Wifi,
    WifiOff
} from 'lucide-react';

function Navbar() {
    const { user, isAuthenticated, isBusiness, logout } = useAuth();
    const { connected } = useSocket();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = isAuthenticated
        ? isBusiness
            ? [
                { to: '/business', label: 'Dashboard', icon: LayoutDashboard },
            ]
            : [
                { to: '/dashboard', label: 'Explore', icon: MapPin },
            ]
        : [
            { to: '/login', label: 'Login', icon: User },
            { to: '/register', label: 'Register', icon: User },
        ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? (isBusiness ? '/business' : '/dashboard') : '/login'} className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                                <Radio className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5">
                                <div className={`live-dot ${connected ? '' : 'opacity-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <span className="text-lg font-bold gradient-text tracking-tight">Hyperlocal</span>
                            <span className="text-lg font-bold text-white tracking-tight"> Lens</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(to)
                                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}

                        {/* Connection Status */}
                        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${connected
                            ? 'text-accent-400 bg-accent-500/10'
                            : 'text-dark-400 bg-dark-800/50'
                            }`}>
                            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                            {connected ? 'Live' : 'Offline'}
                        </div>

                        {/* User Info + Logout */}
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-white/10">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-xl text-dark-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-white/5 animate-slide-down">
                        <div className="flex flex-col gap-1">
                            {navLinks.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(to)
                                        ? 'bg-primary-500/15 text-primary-300'
                                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <button
                                    onClick={() => { logout(); setMobileOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
