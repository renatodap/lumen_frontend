/**
 * LUMEN Landing Page - Million-Dollar Aesthetic
 *
 * Philosophy: Brutally minimal, mathematically perfect
 * - Whitespace as luxury
 * - Typography as hero
 * - Single gold accent
 * - Every element intentional
 */

'use client'

import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size={32} showText={true} variant="dark" />
          <div className="flex items-center gap-4">
            <Link href="/today">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/today">
              <Button variant="gold" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Logo Mark */}
          <div className="flex justify-center">
            <Logo size={120} showText={false} variant="dark" />
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-black leading-none">
              LUMEN
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Your personal operating system enforcer.
              <br />
              Win every day.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/today">
              <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Start Winning
              </Button>
            </Link>
            <Link href="/today">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-16 border-t border-gray-200">
            <p className="text-sm uppercase tracking-widest text-gray-400 font-medium">
              Built for Discipline
            </p>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black">Daily Accountability</h3>
              <p className="text-gray-600 leading-relaxed">
                Win or lose. No middle ground. Every day ends with a verdict.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black">Habit Stacking</h3>
              <p className="text-gray-600 leading-relaxed">
                Build unbreakable chains. Track streaks. Compound daily wins.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-black flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black">Night Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Plan tomorrow tonight. Wake up knowing exactly what to do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            Stop planning. Start winning.
          </h2>
          <Link href="/today">
            <Button variant="gold" size="lg" className="min-w-[240px]">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size={24} showText={true} variant="dark" />
          </div>
          <p className="text-sm text-gray-500">
            © 2025 LUMEN. Personal operating system enforcer.
          </p>
        </div>
      </footer>
    </div>
  )
}
