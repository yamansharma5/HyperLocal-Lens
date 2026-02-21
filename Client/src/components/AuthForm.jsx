import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

function AuthForm({ type = 'login', onSubmit, loading }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = type === 'register';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isRegister && (
        <div>
          <label className="input-label" htmlFor="auth-name">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              id="auth-name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="input-field pl-10"
            />
          </div>
        </div>
      )}

      <div>
        <label className="input-label" htmlFor="auth-email">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="input-field pl-10"
          />
        </div>
      </div>

      <div>
        <label className="input-label" htmlFor="auth-password">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            id="auth-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="input-field pl-10 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isRegister && (
        <div>
          <label className="input-label" htmlFor="auth-role">Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'user' })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300 text-sm font-medium ${form.role === 'user'
                  ? 'border-primary-500/50 bg-primary-500/10 text-primary-300'
                  : 'border-white/10 bg-dark-800/50 text-dark-400 hover:border-white/20'
                }`}
            >
              <User className="w-4 h-4" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'business' })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-300 text-sm font-medium ${form.role === 'business'
                  ? 'border-accent-500/50 bg-accent-500/10 text-accent-300'
                  : 'border-white/10 bg-dark-800/50 text-dark-400 hover:border-white/20'
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Business
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            {isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-dark-400">
        {isRegister ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create One
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

export default AuthForm;
