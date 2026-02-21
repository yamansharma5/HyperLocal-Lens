import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BroadcastCard from '../components/BroadcastCard';
import ChatList from '../components/ChatList';
import {
  Store,
  Radio,
  Plus,
  MapPin,
  Clock,
  Send,
  BadgeCheck,
  BarChart3,
  Tag,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

function BusinessDashboard() {
  const { user } = useAuth();

  // Business registration state
  const [business, setBusiness] = useState(null);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [registerForm, setRegisterForm] = useState({
    shopName: '',
    category: 'Other',
    address: '',
    lat: '',
    lng: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Broadcast state
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastForm, setBroadcastForm] = useState({
    message: '',
    category: 'Offer',
    expiresInHours: 24,
  });
  const [broadcastError, setBroadcastError] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Fetch my business
  const fetchBusiness = useCallback(async () => {
    try {
      const res = await api.get('/business/my');
      setBusiness(res.data.business);
    } catch (err) {
      setBusiness(null);
    } finally {
      setBusinessLoading(false);
    }
  }, []);

  // Fetch my broadcasts
  const fetchBroadcasts = useCallback(async () => {
    try {
      const res = await api.get('/broadcast/my');
      setBroadcasts(res.data.broadcasts || []);
    } catch (err) {
      setBroadcasts([]);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  useEffect(() => {
    if (business) fetchBroadcasts();
  }, [business, fetchBroadcasts]);

  // Auto-detect location for registration
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRegisterForm((f) => ({
          ...f,
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }));
      },
      () => { },
      { enableHighAccuracy: true }
    );
  };

  // Register business
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterLoading(true);
    try {
      await api.post('/business/register', registerForm);
      fetchBusiness();
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Failed to register business');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Create broadcast
  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastError('');
    setBroadcastSuccess('');
    setBroadcastLoading(true);
    try {
      await api.post('/broadcast/create', broadcastForm);
      setBroadcastSuccess('Broadcast sent successfully!');
      setBroadcastForm({ message: '', category: 'Offer', expiresInHours: 24 });
      fetchBroadcasts();
      setTimeout(() => setBroadcastSuccess(''), 5000);
    } catch (err) {
      setBroadcastError(err.response?.data?.message || 'Failed to create broadcast');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const categories = ['Event', 'Kirana', 'Medical', 'Restaurant', 'Hardware', 'Salon', 'Other'];

  const activeBroadcasts = broadcasts.filter((bc) => new Date(bc.expiresAt) > new Date());
  const expiredBroadcasts = broadcasts.filter((bc) => new Date(bc.expiresAt) <= new Date());

  if (businessLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-400 text-sm">Loading your business...</p>
        </div>
      </div>
    );
  }

  // =================== BUSINESS REGISTRATION ===================
  if (!business) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-accent-500/20">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Register Your Business</h1>
          <p className="text-dark-400">Set up your business profile to start broadcasting to nearby customers</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="input-label" htmlFor="biz-shopName">Shop Name</label>
              <input
                id="biz-shopName"
                type="text"
                placeholder="e.g. Sharma Medical Store"
                value={registerForm.shopName}
                onChange={(e) => setRegisterForm({ ...registerForm, shopName: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" htmlFor="biz-category">Category</label>
              <select
                id="biz-category"
                value={registerForm.category}
                onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                className="select-field"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label" htmlFor="biz-address">Address</label>
              <input
                id="biz-address"
                type="text"
                placeholder="Full shop address"
                value={registerForm.address}
                onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label" htmlFor="biz-lat">Latitude</label>
                <input
                  id="biz-lat"
                  type="number"
                  step="any"
                  placeholder="28.6139"
                  value={registerForm.lat}
                  onChange={(e) => setRegisterForm({ ...registerForm, lat: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label" htmlFor="biz-lng">Longitude</label>
                <input
                  id="biz-lng"
                  type="number"
                  step="any"
                  placeholder="77.2090"
                  value={registerForm.lng}
                  onChange={(e) => setRegisterForm({ ...registerForm, lng: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={detectLocation}
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
            >
              <MapPin className="w-4 h-4" />
              Auto-detect My Location
            </button>

            {registerError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {registerError}
              </div>
            )}

            <button
              type="submit"
              disabled={registerLoading}
              className="btn-accent w-full flex items-center justify-center gap-2 py-3"
            >
              {registerLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Register Business
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =================== BUSINESS DASHBOARD ===================
  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-white">{business.shopName}</h1>
              {business.verified && (
                <BadgeCheck className="w-6 h-6 text-accent-400" />
              )}
            </div>
            <p className="text-dark-400 text-sm flex items-center gap-2 flex-wrap">
              <span className="badge-category">{business.category}</span>
              <span className="text-dark-600">·</span>
              <MapPin className="w-3.5 h-3.5" />
              {business.address}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Broadcasts', value: broadcasts.length, icon: Radio, color: 'from-primary-600 to-primary-500' },
          { label: 'Active Now', value: activeBroadcasts.length, icon: Send, color: 'from-accent-600 to-accent-500' },
          { label: 'Expired', value: expiredBroadcasts.length, icon: Clock, color: 'from-dark-600 to-dark-500' },
          { label: 'Reach', value: '5km', icon: Users, color: 'from-amber-600 to-amber-500' },
        ].map(({ label, value, icon: Icon, color }, idx) => (
          <div key={idx} className="glass-card p-5 group hover:border-white/20 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-dark-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Broadcast Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-400" />
              New Broadcast
            </h2>
            <p className="text-xs text-dark-400 mb-6">Send a message to customers within 5km</p>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div>
                <label className="input-label" htmlFor="bc-message">Message</label>
                <textarea
                  id="bc-message"
                  placeholder="e.g. 20% off on all items this weekend!"
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  maxLength={500}
                  rows={4}
                  required
                  className="input-field resize-none"
                />
                <p className="text-xs text-dark-500 mt-1 text-right">{broadcastForm.message.length}/500</p>
              </div>

              <div>
                <label className="input-label" htmlFor="bc-category">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Offer', 'Community'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBroadcastForm({ ...broadcastForm, category: cat })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all duration-300 ${broadcastForm.category === cat
                        ? cat === 'Offer'
                          ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                          : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                        : 'border-white/10 bg-dark-800/50 text-dark-400 hover:border-white/20'
                        }`}
                    >
                      {cat === 'Offer' ? <Tag className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="bc-expires">Expires In</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <select
                    id="bc-expires"
                    value={broadcastForm.expiresInHours}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, expiresInHours: Number(e.target.value) })}
                    className="select-field pl-10"
                  >
                    <option value={1}>1 hour</option>
                    <option value={3}>3 hours</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={48}>2 days</option>
                    <option value={72}>3 days</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>
              </div>

              {broadcastError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {broadcastError}
                </div>
              )}

              {broadcastSuccess && (
                <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm flex items-center gap-2 animate-slide-up">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {broadcastSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={broadcastLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {broadcastLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Radio className="w-5 h-5" />
                    Send Broadcast
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Broadcasts List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              My Broadcasts
            </h2>
            <span className="text-xs text-dark-400">
              {activeBroadcasts.length} active · {expiredBroadcasts.length} expired
            </span>
          </div>

          {broadcasts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Radio className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-300 mb-2">No broadcasts yet</h3>
              <p className="text-dark-500 text-sm">Create your first broadcast to reach nearby customers!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active */}
              {activeBroadcasts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-accent-400 mb-3 flex items-center gap-2">
                    <div className="live-dot"></div>
                    Active ({activeBroadcasts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeBroadcasts.map((bc) => (
                      <BroadcastCard key={bc._id} broadcast={bc} />
                    ))}
                  </div>
                </div>
              )}

              {/* Expired */}
              {expiredBroadcasts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-dark-400 mb-3">
                    Expired ({expiredBroadcasts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-50">
                    {expiredBroadcasts.map((bc) => (
                      <BroadcastCard key={bc._id} broadcast={bc} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Section */}
      <div className="mt-8">
        <ChatList />
      </div>
    </div>
  );
}

export default BusinessDashboard;
