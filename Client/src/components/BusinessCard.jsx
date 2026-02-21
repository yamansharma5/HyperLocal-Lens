import React from 'react';
import { MapPin, BadgeCheck, Store, Tag } from 'lucide-react';

const categoryColors = {
    Event: { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/30' },
    Kirana: { bg: 'bg-green-500/15', text: 'text-green-300', border: 'border-green-500/30' },
    Medical: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/30' },
    Restaurant: { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/30' },
    Hardware: { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
    Salon: { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
    Other: { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
};

const categoryEmojis = {
    Event: '🎉',
    Kirana: '🛒',
    Medical: '💊',
    Restaurant: '🍕',
    Hardware: '🔧',
    Salon: '💇',
    Other: '🏬',
};

function BusinessCard({ business }) {
    const { shopName, category, address, verified, location } = business;
    const colors = categoryColors[category] || categoryColors.Other;
    const emoji = categoryEmojis[category] || '🏬';

    return (
        <div className="glass-card-hover p-5 relative group">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-xl shrink-0`}>
                    {emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-base truncate">{shopName}</h3>
                        {verified && (
                            <BadgeCheck className="w-4 h-4 text-accent-400 shrink-0" />
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
                            {category}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-dark-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{address}</span>
                    </div>
                </div>
            </div>

            {/* Verified glow */}
            {verified && (
                <div className="absolute top-2 right-3">
                    <span className="badge-verified text-[10px]">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                    </span>
                </div>
            )}
        </div>
    );
}

export default BusinessCard;
