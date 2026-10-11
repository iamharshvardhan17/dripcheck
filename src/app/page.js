'use client';

import Link from 'next/link';
import {
  Shirt,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
  Brain,
  Sun,
  Heart,
  BarChart3,
  Check,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      number: '01',
      title: 'Add Your Clothes',
      description: 'Upload photos and tag your clothes by type, color, and occasion in just a few taps.',
      icon: Plus,
      badge: 'Quick Setup',
    },
    {
      number: '02',
      title: 'Pick an Occasion',
      description: 'Going to a party? A meeting? Just a chill day? Tell us what vibe or event you need.',
      icon: Calendar,
      badge: 'Smart Context',
    },
    {
      number: '03',
      title: 'Get Your Outfit',
      description: 'We match the best combo from YOUR wardrobe. No new shopping needed, just styled confidence.',
      icon: Sparkles,
      badge: 'Instant Match',
    },
  ];

  const features = [
    {
      title: 'Smart Matching',
      description: 'Intelligent color harmonies and silhouette rules that pair your tops, bottoms, and shoes flawlessly.',
      icon: Brain,
      tag: 'Color Engine',
    },
    {
      title: 'Season Aware',
      description: 'Automatically filters your closet to match summer heatwaves, winter chills, or monsoon breezes.',
      icon: Sun,
      tag: 'Weather Ready',
    },
    {
      title: 'Favorites & Collections',
      description: 'Save go-to outfit combinations and quick-bookmark your signature lookbooks for effortless mornings.',
      icon: Heart,
      tag: 'Personalized',
    },
    {
      title: 'Track Wear Count',
      description: 'Discover your most-worn items, identify hidden gems you neglect, and calculate your true cost-per-wear.',
      icon: BarChart3,
      tag: 'Closet Analytics',
    },
  ];

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Essential closet organization for everyday style enthusiasts.',
      highlight: false,
      features: [
        'Up to 30 wardrobe items',
        'Basic outfit matching algorithm',
        'Standard color & season tags',
        'Local browser storage & sync',
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50',
    },
    {
      name: 'Pro',
      price: '$4.99',
      period: 'per month',
      badge: 'Most Popular',
      description: 'Full AI-powered stylist experience for the organized fashion lover.',
      highlight: true,
      features: [
        'Unlimited wardrobe items',
        'Advanced AI occasion matching',
        'Complete outfit history & favorites',
        'Cost-per-wear analytics & insights',
        'Priority feature updates',
      ],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200 hover:shadow-lg',
    },
    {
      name: 'Team & Family',
      price: '$9.99',
      period: 'per month',
      description: 'Shared wardrobe access for partners, families, and creative teams.',
      highlight: false,
      features: [
        'Up to 5 wardrobe profiles',
        'Shared borrowing & clothing lending tags',
        'Collaborative outfit planning',
        'All Pro styling algorithms',
        'Dedicated styling support',
      ],
      buttonText: 'Choose Team',
      buttonStyle: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      {/* Inline Landing Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 group-hover:scale-105 transition-transform">
              <Shirt className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-700">
              DripCheck
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm hover:shadow transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-brand-50 via-white to-[#FAFAFA] overflow-hidden">
        {/* Subtle Decorative Background Shapes */}
        <div
          aria-hidden="true"
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-200/40 rounded-full blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-48 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-36 left-10 w-64 h-64 bg-pink-100/40 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 border border-brand-200/60 text-brand-800 text-xs sm:text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Effortless Everyday Dressing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
            Your Wardrobe, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 bg-clip-text text-transparent">
              Smartly Organized
            </span>
          </h1>

          {/* Subline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 font-normal leading-relaxed mb-10">
            Stop staring at your closet. Add your clothes, pick an occasion, and get the perfect outfit in seconds.
          </p>

          {/* Primary CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Organizing — It&apos;s Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/outfit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <span>Try Outfit Picker</span>
            </Link>
          </div>

          {/* Mini Trust Elements */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Works directly in browser</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Instant outfit combinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              How DripCheck Works
            </p>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Say goodbye to morning decision fatigue in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative group bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-100/70 text-brand-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-gray-500 border border-gray-100">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {step.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-semibold text-brand-600">
                    {step.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Features
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything You Need to Dress Smarter
            </p>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Engineered with modern styling logic to maximize the versatility of your current wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-7 rounded-2xl border border-gray-100 hover:border-brand-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-brand-600 flex items-center justify-center mb-6">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-brand-700 bg-brand-50 w-fit px-2.5 py-1 rounded-md">
                    {feature.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Pricing Plans
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Simple, Transparent Pricing
            </p>
            <p className="mt-4 text-gray-600 text-base sm:text-lg">
              Start free today and upgrade whenever your closet collection expands.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  tier.highlight
                    ? 'bg-brand-50/70 border-2 border-brand-500 shadow-xl lg:-translate-y-2'
                    : 'bg-white border border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                      {tier.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      /{tier.period}
                    </span>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/dashboard"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all ${tier.buttonStyle}`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Shirt className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                DripCheck
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/wardrobe" className="hover:text-white transition-colors">
                My Wardrobe
              </Link>
              <Link href="/outfit" className="hover:text-white transition-colors">
                Outfit Picker
              </Link>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>&copy; {new Date().getFullYear()} DripCheck Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
