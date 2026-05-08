import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LandingHeader() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = user?.role === 'business' ? '/business' : '/dashboard';

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="h-16 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-white hover:text-white/90 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Leadgen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[17px] text-white/70">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#resources" className="hover:text-white transition-colors inline-flex items-center gap-1">
              Resources
              <ChevronDown className="w-4 h-4" />
            </a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                to={dashboardPath}
                className="text-sm sm:text-base font-medium text-white/90 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm sm:text-base font-medium text-white/90 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to={isAuthenticated ? dashboardPath : '/register'}
              className="inline-flex items-center justify-center h-10 sm:h-11 px-5 sm:px-6 rounded-full bg-white text-black text-sm sm:text-base font-semibold hover:bg-white/90 transition-colors"
            >
              {isAuthenticated ? 'Go to app' : 'Try for free'}
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default LandingHeader;
