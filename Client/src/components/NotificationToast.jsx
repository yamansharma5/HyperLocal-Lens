import React, { useEffect, useState } from 'react';
import { Radio, X, Store } from 'lucide-react';

function NotificationToast({ broadcast, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 8000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!broadcast) return null;

    return (
        <div
            className={`fixed top-20 right-4 z-50 max-w-sm w-full transition-all duration-300 ${visible ? 'animate-slide-down opacity-100' : 'opacity-0 translate-y-[-20px]'
                }`}
        >
            <div className="glass-card border-primary-500/40 p-4 shadow-2xl shadow-primary-500/10">
                <div className="flex items-start gap-3">
                    {/* Pulse Icon */}
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
                        <Radio className="w-5 h-5 text-primary-400 animate-pulse" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-bold text-primary-300 uppercase tracking-wide flex items-center gap-1">
                                <div className="live-dot" style={{ width: '6px', height: '6px' }}></div>
                                Live Broadcast
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-dark-400" />
                            {broadcast.businessName || broadcast.broadcast?.business?.shopName || 'Local Business'}
                        </p>
                        <p className="text-xs text-dark-300 line-clamp-2">
                            {broadcast.broadcast?.message || broadcast.message || 'New broadcast available'}
                        </p>
                    </div>

                    {/* Close */}
                    <button
                        onClick={() => {
                            setVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-0.5 bg-dark-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        style={{
                            animation: 'shrinkWidth 8s linear forwards',
                        }}
                    />
                </div>
            </div>

            <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
}

export default NotificationToast;
