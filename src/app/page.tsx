'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  BarChart3,
  Zap,
  Lock,
  TrendingUp,
  Code2,
  RefreshCw,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Simple Analytics</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                Pricing
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="#features"
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
              >
                Pricing
              </Link>
              <div className="flex gap-2 pt-2">
               <Link href={'/sign-in'}>
                <Button variant="ghost" size="sm" className="w-full">
                  Log In
                </Button>
               </Link>
                <Link href={'/sign-up'}>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6 md:mb-8">
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs md:text-sm text-secondary-foreground font-medium">
              Now tracking 10K+ websites
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Analytics that actually work.
            <span className="block text-primary">Drop a script, get insights.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Lightweight website analytics without the bloat. Real-time dashboards, automatic session tracking, and intelligent caching. Works everywhere.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
            <p>Trusted by</p>
            <div className="flex items-center gap-6 flex-wrap justify-center opacity-60">
              <span className="font-semibold">TechStart</span>
              <span className="font-semibold">DataCorp</span>
              <span className="font-semibold">WebFlow</span>
              <span className="font-semibold">CloudSync</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-secondary/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to understand your visitors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful analytics built for simplicity and speed.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Optimized tracking script loads in milliseconds. Zero impact on your site performance.
              </p>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Privacy First</h3>
              <p className="text-muted-foreground text-sm">
                No cookies, no personal data collection. Fully compliant with GDPR and privacy regulations.
              </p>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-Time Data</h3>
              <p className="text-muted-foreground text-sm">
                See your analytics update instantly. No delays, no waiting. Pure real-time insights.
              </p>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Integration</h3>
              <p className="text-muted-foreground text-sm">
                One line of JavaScript. Copy, paste, done. Works with any framework or static site.
              </p>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Smart Caching</h3>
              <p className="text-muted-foreground text-sm">
                Background aggregation keeps your dashboard lightning fast at any scale.
              </p>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Session Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Automatic session detection with device, browser, and OS information. UTM support included.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started in 3 minutes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Seriously. It's that simple.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Register Your Website',
                description: 'Add your website URL to your dashboard. We\'ll generate a unique tracking script for you.',
              },
              {
                step: '2',
                title: 'Embed the Script',
                description: 'Copy one line of JavaScript and paste it into your website. That\'s literally it.',
              },
              {
                step: '3',
                title: 'Watch the Data Flow',
                description: 'Events start arriving instantly. Watch your real-time dashboard come to life.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                {item.step !== '3' && (
                  <div className="hidden md:block absolute top-6 -right-4 text-muted-foreground">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code Example */}
          <div className="mt-16">
            <div className="bg-secondary border border-border rounded-lg p-6">
              <p className="text-sm font-medium text-foreground mb-4">Installation Script</p>
              <div className="bg-background rounded p-4 overflow-x-auto">
                <code className="text-sm text-muted-foreground font-mono">
                  {`<script src="https://your-domain.com/pixel.js" defer></script>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-secondary/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-muted-foreground">Active Websites</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">5B+</p>
              <p className="text-muted-foreground">Events Tracked Monthly</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">99.9%</p>
              <p className="text-muted-foreground">Uptime SLA</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">&lt;50ms</p>
              <p className="text-muted-foreground">Average Response Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple pricing for every size
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free. Pay only for what you use. No surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground text-sm mb-6">Perfect for small projects</p>
              <p className="text-3xl font-bold mb-6">
                Free
                <span className="text-sm text-muted-foreground font-normal"> forever</span>
              </p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Up to 10K monthly events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Basic analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Community support
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Start Free
              </Button>
            </Card>

            <Card className="p-8 border-primary border-2 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">Professional</h3>
              <p className="text-muted-foreground text-sm mb-6">Growing businesses</p>
              <p className="text-3xl font-bold mb-2">
                $29
                <span className="text-sm text-muted-foreground font-normal">/month</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">+ $0.05 per 1K events</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Unlimited events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Custom events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Email support
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </Card>

            <Card className="p-8">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-6">Custom solutions</p>
              <p className="text-3xl font-bold mb-6">
                Custom
              </p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  SLA guarantee
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Dedicated support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </span>
                  Custom integrations
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32 bg-secondary/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to understand your visitors?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of websites already using Simple Analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 lg:px-8 py-12 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Simple Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Lightweight analytics for the modern web.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Status</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 Simple Analytics. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-foreground transition">Twitter</Link>
              <Link href="#" className="hover:text-foreground transition">GitHub</Link>
              <Link href="#" className="hover:text-foreground transition">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
