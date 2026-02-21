import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { Radio, MapPin, Zap, Shield } from 'lucide-react';

function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (form) => {
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'business') {
        navigate('/business');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-dark-950 to-primary-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent_50%)]"></div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Hyperlocal</h1>
                <p className="text-dark-400 text-sm font-medium">Lens Platform</p>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Discover Local<br />
              <span className="gradient-text">Businesses Near You</span>
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed max-w-md">
              Connect with businesses within 5km of your location. Get real-time broadcasts, offers, and community updates.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { icon: MapPin, title: 'Geo-Targeted Discovery', desc: 'Find businesses within 5km radius' },
              { icon: Zap, title: 'Real-Time Broadcasts', desc: 'Instant alerts from local businesses' },
              { icon: Shield, title: 'Verified Businesses', desc: 'Trusted and vetted local shops' },
            ].map(({ icon: Icon, title, desc }, idx) => (//
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:border-primary-500/30 transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-dark-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Hyperlocal Lens</span>
          </div>

          <div className="glass-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-dark-400 text-sm">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-down">
                {error}
              </div>
            )}

            <AuthForm type="login" onSubmit={handleLogin} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
