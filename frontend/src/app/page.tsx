'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, RefreshCw, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">BCH</div>
          BCH Pay
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it works</a>
          <Link href="/onboarding" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-100">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Accept BCH. Get <span className="text-green-600">Stablecoins.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          The simplest way for merchants to accept Bitcoin Cash without the volatility.
          Automatic conversion to USDT and instant settlements.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/onboarding" className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-xl shadow-green-100">
            Get Started Now
          </Link>
          <button className="bg-white border-2 border-gray-100 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="text-green-600" />}
              title="Secure"
              description="Non-custodial options and enterprise-grade security for your funds."
            />
            <FeatureCard
              icon={<Zap className="text-orange-500" />}
              title="Instant"
              description="0-conf support for lightning fast point-of-sale transactions."
            />
            <FeatureCard
              icon={<RefreshCw className="text-blue-500" />}
              title="Auto-Swap"
              description="Automatically convert BCH to USDT to avoid price volatility."
            />
            <FeatureCard
              icon={<BarChart3 className="text-purple-500" />}
              title="Reporting"
              description="Detailed analytics and transaction history for your business."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2023 BCH Pay Gateway. Built for the future of commerce.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
