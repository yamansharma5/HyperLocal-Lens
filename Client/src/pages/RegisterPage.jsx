import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { Radio, Users, Store, Globe } from 'lucide-react';

function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (form) => {
    setLoading(true);
    setError('');
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      if (user.role === 'business') {
        navigate('/business');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-900/60 via-dark-950 to-primary-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1),transparent_50%)]"></div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center shadow-2xl shadow-accent-500/30">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Hyperlocal</h1>
                <p className="text-dark-400 text-sm font-medium">Lens Platform</p>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Join the Local<br />
              <span className="gradient-text">Discovery Network</span>
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed max-w-md">
              Whether you're a customer looking for deals or a business reaching your neighborhood — we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, value: '5km', label: 'Radius' },
              { icon: Store, value: 'Live', label: 'Broadcasts' },
              { icon: Globe, value: 'Free', label: 'Forever' },
            ].map(({ icon: Icon, value, label }, idx) => (
              <div key={idx} className="glass-card p-4 text-center group hover:border-accent-500/30 transition-all duration-300">
                <Icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-dark-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Hyperlocal Lens</span>
          </div>

          <div className="glass-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
              <p className="text-dark-400 text-sm">Get started with Hyperlocal Lens today</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-down">
                {error}
              </div>
            )}

            <AuthForm type="register" onSubmit={handleRegister} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
