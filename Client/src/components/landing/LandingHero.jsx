import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LandingHero() {
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = user?.role === 'business' ? '/business' : '/dashboard';

  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 sm:pt-36 pb-14 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 mb-7"
        >
          <span className="text-base sm:text-lg text-white/85">We've raised $69M seed funding</span>
          <ArrowRight className="w-4 h-4 text-white/70" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.6, ease: 'easeOut' }}
          className="max-w-5xl text-[52px] leading-[0.98] sm:text-[74px] sm:leading-[0.95] lg:text-[92px] lg:leading-[0.92] font-semibold tracking-[-0.03em] text-white/90"
        >
          Get warm leads for your business in minutes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
          className="mt-7 max-w-3xl text-[22px] leading-relaxed text-white/70"
        >
          Our AI-powered platform identifies and qualifies potential customers,
          so you can focus on closing deals instead of chasing cold leads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.5, ease: 'easeOut' }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to={isAuthenticated ? dashboardPath : '/register'}
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black text-xl font-semibold hover:bg-white/90 transition-colors"
          >
            {isAuthenticated ? 'Open Dashboard' : 'Get Started'}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#product"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/20 bg-white/[0.08] text-white text-xl font-semibold hover:bg-white/[0.12] transition-colors"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingHero;
