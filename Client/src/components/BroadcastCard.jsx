import React from 'react';
import { Clock, Radio, Store, Tag, MapPin, MessageCircle } from 'lucide-react';

function BroadcastCard({ broadcast, isNew = false, onContact }) {
    const { message, category, expiresAt, business, createdAt } = broadcast;

    const timeLeft = () => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry - now;

        if (diff <= 0) return 'Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h left`;
        }
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    const timeAgo = () => {
        const now = new Date();
        const created = new Date(createdAt);
        const diff = now - created;
        const minutes = Math.floor(diff / (1000 * 60));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const isExpired = new Date(expiresAt) <= new Date();

    return (
        <div className={`glass-card-hover p-5 ${isNew ? 'animate-bounce-in border-primary-500/40 shadow-primary-500/20 shadow-lg' : ''}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category === 'Offer'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-cyan-500/15 text-cyan-400'
                        }`}>
                        {category === 'Offer' ? <Tag className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-dark-400" />
                            {business?.shopName || 'Unknown Business'}
                        </h3>
                        <p className="text-xs text-dark-400">{timeAgo()}</p>
                    </div>
                </div>
                <span className={category === 'Offer' ? 'badge-offer' : 'badge-community'}>
                    {category}
                </span>
            </div>

            {/* Message */}
            <p className="text-dark-200 text-sm leading-relaxed mb-4 pl-[52px]">
                {message}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pl-[52px]">
                <div className="flex items-center gap-1.5 text-xs text-dark-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft()}</span>
                </div>
                {business?.category && (
                    <span className="badge-category text-[10px]">{business.category}</span>
                )}
            </div>

            {/* Contact Business Button */}
            {onContact && business?._id && !isExpired && (
                <div className="mt-4 pl-[52px]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onContact({
                                businessId: business._id,
                                businessName: business.shopName,
                                broadcastText: message,
                            });
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold hover:bg-primary-500/20 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 group"
                    >
                        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Contact Business
                    </button>
                </div>
            )}

            {/* New indicator */}
            {isNew && (
                <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-primary-300 bg-primary-500/20 px-2 py-0.5 rounded-full border border-primary-500/30">
                        <div className="live-dot" style={{ width: '6px', height: '6px' }}></div>
                        NEW
                    </span>
                </div>
            )}
        </div>
    );
}

export default BroadcastCard;
