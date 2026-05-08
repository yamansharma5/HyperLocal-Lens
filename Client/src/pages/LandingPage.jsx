import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Radio, ShieldCheck, MapPinned, Sparkles, CheckCircle2 } from 'lucide-react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingHero from '../components/landing/LandingHero';

const features = [
	{
		title: 'Smart Geo Discovery',
		desc: 'Locate nearby demand within a 5 km radius and prioritize high-intent customers first.',
		icon: MapPinned,
	},
	{
		title: 'Live Broadcast Engine',
		desc: 'Send time-limited offers to local users in real-time with a single click.',
		icon: Radio,
	},
	{
		title: 'Verified Business Profiles',
		desc: 'Build trust with clean business identities and role-based platform access.',
		icon: ShieldCheck,
	},
];

const steps = [
	'Create your business profile and set your location',
	'Broadcast offers or community updates to nearby users',
	'Track visibility and bring customers in faster',
];

const faqs = [
	{
		q: 'Who can use Hyperlocal Lens?',
		a: 'Both local customers and businesses. Customers discover nearby activity and businesses send targeted broadcasts.',
	},
	{
		q: 'How far does discovery work?',
		a: 'The platform focuses on a 5 km hyperlocal radius for relevant and practical neighborhood discovery.',
	},
	{
		q: 'Do I need technical setup to start?',
		a: 'No setup is required. Register, complete your profile, and start using the dashboard immediately.',
	},
];

function LandingPage() {
	return (
		<div className="relative min-h-screen bg-[#030303] text-white overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.18),transparent_35%)] pointer-events-none" />
			<div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0.96))] pointer-events-none" />

			<LandingHeader />
			<main className="relative z-10">
				<LandingHero />

				<section id="product" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className="mb-12"
					>
						<p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">Feature Highlights</p>
						<h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/90 max-w-3xl">
							Built for local growth with real-time neighborhood visibility.
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
						{features.map((item, idx) => (
							<motion.article
								key={item.title}
								initial={{ opacity: 0, y: 22 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{ delay: idx * 0.08, duration: 0.45, ease: 'easeOut' }}
								className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
							>
								<div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-5">
									<item.icon className="w-5 h-5 text-white/90" />
								</div>
								<h3 className="text-xl font-semibold text-white/90 mb-2">{item.title}</h3>
								<p className="text-white/65 leading-relaxed">{item.desc}</p>
							</motion.article>
						))}
					</div>
				</section>

				<section id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, amount: 0.35 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
						>
							<p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">How It Works</p>
							<h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/90">
								Launch local campaigns in three clear steps.
							</h2>
						</motion.div>

						<div className="space-y-4">
							{steps.map((step, index) => (
								<motion.div
									key={step}
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, amount: 0.4 }}
									transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
									className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex items-center gap-3"
								>
									<div className="w-7 h-7 rounded-full bg-white text-black text-sm font-semibold flex items-center justify-center shrink-0">
										{index + 1}
									</div>
									<p className="text-white/75 text-lg">{step}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10">
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}
						className="mb-8"
					>
						<p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">FAQ</p>
						<h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/90">Answers before you start</h2>
					</motion.div>

					<div className="space-y-3">
						{faqs.map((item, idx) => (
							<motion.details
								key={item.q}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ delay: idx * 0.06, duration: 0.4, ease: 'easeOut' }}
								className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5"
							>
								<summary className="cursor-pointer list-none flex items-center justify-between gap-4">
									<span className="text-lg font-medium text-white/90">{item.q}</span>
									<ArrowUpRight className="w-5 h-5 text-white/60 group-open:rotate-45 transition-transform" />
								</summary>
								<p className="text-white/65 mt-3 leading-relaxed">{item.a}</p>
							</motion.details>
						))}
					</div>
				</section>

				<section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 border-t border-white/10">
					<div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 sm:p-12 text-center">
						<Sparkles className="w-8 h-8 mx-auto text-white/85 mb-4" />
						<h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white/90 mb-4">
							Ready to launch your hyperlocal growth engine?
						</h3>
						<p className="text-white/65 max-w-2xl mx-auto mb-8 text-lg">
							Join as a business to broadcast offers instantly, or explore as a customer to discover what is happening near you.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Link
								to="/register"
								className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors"
							>
								Create Account
								<CheckCircle2 className="w-4 h-4" />
							</Link>
							<Link
								to="/login"
								className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-white/20 bg-white/[0.08] text-white font-semibold hover:bg-white/[0.12] transition-colors"
							>
								Login
							</Link>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

export default LandingPage;
