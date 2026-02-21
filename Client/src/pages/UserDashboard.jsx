import React, { useEffect, useState, useCallback } from 'react';
import MapView from '../components/MapView';
import BroadcastCard from '../components/BroadcastCard';
import BusinessCard from '../components/BusinessCard';
import NotificationToast from '../components/NotificationToast';
import ChatWindow from '../components/ChatWindow';
import ChatList from '../components/ChatList';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import {
  MapPin,
  Radio,
  Store,
  RefreshCw,
  Locate,
  Filter,
  ChevronDown,
  Search,
  Loader2,
  MessageSquare,
} from 'lucide-react';

function UserDashboard() {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 }); // Default: Delhi
  const [businesses, setBusinesses] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // map, businesses, broadcasts, messages
  const [notification, setNotification] = useState(null);
  const [newBroadcastIds, setNewBroadcastIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [chatTarget, setChatTarget] = useState(null); // { businessId, businessName, broadcastText }
  const { socket } = useSocket();

  // IP geolocation fallback
  const getLocationFromIP = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.latitude && data.longitude) return { lat: data.latitude, lng: data.longitude };
    } catch { /* ignore */ }
    try {
      const res = await fetch('https://ip-api.com/json/?fields=lat,lon');
      const data = await res.json();
      if (data.lat && data.lon) return { lat: data.lat, lng: data.lon };
    } catch { /* ignore */ }
    return null;
  };

  // Get user location (browser geo → IP fallback → default)
  const detectLocation = useCallback(async () => {
    setLocating(true);

    // Try browser geolocation first (without forcing high accuracy for better desktop support)
    const browserGeo = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
        );
      });

    const pos = await browserGeo();
    if (pos) {
      setLocation(pos);
      setLocating(false);
      return;
    }

    // Fallback to IP-based geolocation
    const ipPos = await getLocationFromIP();
    if (ipPos) {
      setLocation(ipPos);
    }
    // If both fail, default Delhi coordinates are already set in state
    setLocating(false);
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bizRes, bcRes] = await Promise.all([
        api.get(`/business/nearby?lat=${location.lat}&lng=${location.lng}`),
        api.get(`/broadcast/nearby?lat=${location.lat}&lng=${location.lng}`),
      ]);
      setBusinesses(bizRes.data.businesses || bizRes.data || []);
      setBroadcasts(bcRes.data.broadcasts || bcRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Socket.io — listen for new broadcasts
  useEffect(() => {
    if (!socket) return;

    const handleNewBroadcast = (data) => {
      console.log('📡 New broadcast received:', data);

      // Show notification
      setNotification(data);

      // Add to broadcasts list
      if (data.broadcast) {
        setBroadcasts((prev) => [data.broadcast, ...prev]);
        setNewBroadcastIds((prev) => new Set([...prev, data.broadcast._id]));

        // Remove "new" indicator after 30 seconds
        setTimeout(() => {
          setNewBroadcastIds((prev) => {
            const updated = new Set(prev);
            updated.delete(data.broadcast._id);
            return updated;
          });
        }, 30000);
      }
    };

    socket.on('newBroadcast', handleNewBroadcast);

    return () => {
      socket.off('newBroadcast', handleNewBroadcast);
    };
  }, [socket]);

  // Filters
  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredBroadcasts = broadcasts.filter((bc) => {
    const matchesSearch = bc.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bc.business?.shopName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ||
      bc.category === categoryFilter ||
      bc.business?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Event', 'Kirana', 'Medical', 'Restaurant', 'Hardware', 'Salon', 'Other'];

  // Handle contact from broadcast card
  const handleContact = ({ businessId, businessName, broadcastText }) => {
    setChatTarget({ businessId, businessName, broadcastText });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <NotificationToast
          broadcast={notification}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Explore <span className="gradient-text">Nearby</span>
            </h1>
            <p className="text-dark-400 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              <span className="text-dark-600">·</span>
              <span className="text-primary-400">{businesses.length} businesses</span>
              <span className="text-dark-600">·</span>
              <span className="text-accent-400">{broadcasts.length} broadcasts</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={detectLocation}
              disabled={locating}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
              {locating ? 'Detecting...' : 'My Location'}
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search businesses or broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
            id="search-input"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select-field pl-9 pr-8 py-2.5 text-sm min-w-[140px]"
            id="category-filter"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 bg-dark-900/50 p-1 rounded-xl inline-flex border border-white/5">
        {[
          { key: 'map', label: 'Map View', icon: MapPin },
          { key: 'businesses', label: `Businesses (${filteredBusinesses.length})`, icon: Store },
          { key: 'broadcasts', label: `Broadcasts (${filteredBroadcasts.length})`, icon: Radio },
          { key: 'messages', label: 'Messages', icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === key
              ? 'bg-primary-500/15 text-primary-300 shadow-sm'
              : 'text-dark-400 hover:text-white'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-dark-400 text-sm">Discovering nearby businesses...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Map Tab */}
          {activeTab === 'map' && (
            <div className="animate-fade-in">
              <MapView
                lat={location.lat}
                lng={location.lng}
                businesses={filteredBusinesses}
                broadcasts={filteredBroadcasts}
              />

              {/* Quick Stats below map */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { label: 'Businesses', value: filteredBusinesses.length, icon: Store, color: 'text-accent-400' },
                  { label: 'Broadcasts', value: filteredBroadcasts.length, icon: Radio, color: 'text-primary-400' },
                  { label: 'Radius', value: '5 km', icon: MapPin, color: 'text-amber-400' },
                  { label: 'Status', value: 'Live', icon: () => <div className="live-dot"></div>, color: 'text-accent-400' },
                ].map(({ label, value, icon: Icon, color }, idx) => (
                  <div key={idx} className="glass-card p-4 text-center">
                    <div className={`${color} flex justify-center mb-2`}>
                      {typeof Icon === 'function' ? <Icon /> : <Icon className="w-5 h-5" />}
                    </div>
                    <p className="text-lg font-bold text-white">{value}</p>
                    <p className="text-xs text-dark-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="animate-fade-in">
              {filteredBusinesses.length === 0 ? (
                <div className="text-center py-20">
                  <Store className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark-300 mb-2">No businesses found</h3>
                  <p className="text-dark-500 text-sm">Try adjusting your search or location</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBusinesses.map((biz) => (
                    <BusinessCard key={biz._id} business={biz} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Broadcasts Tab */}
          {activeTab === 'broadcasts' && (
            <div className="animate-fade-in">
              {filteredBroadcasts.length === 0 ? (
                <div className="text-center py-20">
                  <Radio className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark-300 mb-2">No active broadcasts</h3>
                  <p className="text-dark-500 text-sm">Check back later for local updates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBroadcasts.map((bc) => (
                    <BroadcastCard
                      key={bc._id}
                      broadcast={bc}
                      isNew={newBroadcastIds.has(bc._id)}
                      onContact={handleContact}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="animate-fade-in">
              <ChatList />
            </div>
          )}
        </>
      )}

      {/* Chat Window Modal (triggered from broadcast contact button) */}
      {chatTarget && (
        <ChatWindow
          businessId={chatTarget.businessId}
          businessName={chatTarget.businessName}
          broadcastText={chatTarget.broadcastText}
          onClose={() => setChatTarget(null)}
        />
      )}
    </div>
  );
}

export default UserDashboard;
