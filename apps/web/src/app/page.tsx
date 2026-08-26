'use client';

import React from 'react';
import {
  Mountain,
  Wifi,
  WifiOff,
  Server,
  Database,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Smartphone,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Lock,
  User,
  Store,
  Shield,
  LogOut,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function HomePage() {
  const { data: health, isLoading, isError, error, refetch, isFetching } = useHealthCheck();
  const { isOnline } = useOnlineStatus();
  const { data: session, status: authStatus } = useSession();

  const handleQuickLogin = (email: string) => {
    signIn('credentials', {
      email,
      password: email.startsWith('admin')
        ? 'Admin@12345'
        : email.startsWith('vendor')
          ? 'Vendor@12345'
          : 'Tourist@12345',
      redirect: false,
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#073b35] via-[#042420] to-[#011412] px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative Himalayan Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#0fb49a]/20 to-[#f59e0b]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Top Bar / Navigation */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-950/50">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Sikkim Yatra
                </h1>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                  v0.1.0 Scaffold
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 sm:text-sm">
                Smart Offline-First Digital Tourism Platform for Sikkim
              </p>
            </div>
          </div>

          {/* Network & PWA Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md transition-all ${
                isOnline
                  ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                  : 'border border-amber-500/40 bg-amber-950/40 text-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Online Mode</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-amber-400" />
                  <span>Offline Cache Ready</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/40 px-3 py-1 text-xs font-medium text-teal-300 backdrop-blur-md">
              <Smartphone className="h-3.5 w-3.5 text-teal-400" />
              <span>PWA Enabled</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mt-8 text-center sm:mt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-4 py-1.5 text-xs font-medium text-emerald-200 backdrop-blur-md mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Full-Stack Auth & Schema Scaffold Active</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Gateway to the{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Himalayas
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-emerald-200/80 sm:text-base">
            Engineered with NextAuth role-based authentication, offline caching, Express REST API,
            PostgreSQL Prisma ORM, and comprehensive Sikkim tourism schema.
          </p>
        </section>

        {/* Authentication & Role Demo Card */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    NextAuth.js Role Authentication
                  </h3>
                  <p className="text-xs text-emerald-300/70">
                    Supports Credentials (Email/Password) + Google OAuth with Role Guards
                  </p>
                </div>
              </div>

              {session ? (
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : null}
            </div>

            <div className="mt-6">
              {authStatus === 'loading' ? (
                <div className="py-4 text-center text-xs text-emerald-300/70">
                  Checking authentication session...
                </div>
              ) : session?.user ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-lg border border-emerald-500/40">
                        {session.user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{session.user.name}</h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                              session.user.role === 'ADMIN'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : session.user.role === 'VENDOR'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {session.user.role}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-300/80 font-mono">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-emerald-300/70 bg-black/30 rounded-xl p-3 font-mono">
                      User ID: {session.user.id?.slice(0, 12)}...
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-emerald-200/80 mb-3">
                    Quick test login using seeded role credentials:
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* Tourist Login */}
                    <button
                      onClick={() => handleQuickLogin('tourist@sikkimyatra.com')}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-left hover:bg-emerald-950/60 transition-all hover:border-emerald-500/60 group"
                    >
                      <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400 group-hover:scale-105 transition-transform">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Login as Tourist</div>
                        <div className="text-[11px] text-emerald-300/70 font-mono">
                          tourist@sikkimyatra.com
                        </div>
                      </div>
                    </button>

                    {/* Vendor Login */}
                    <button
                      onClick={() => handleQuickLogin('vendor@sikkimyatra.com')}
                      className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-left hover:bg-amber-950/40 transition-all hover:border-amber-500/60 group"
                    >
                      <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400 group-hover:scale-105 transition-transform">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Login as Vendor</div>
                        <div className="text-[11px] text-amber-300/70 font-mono">
                          vendor@sikkimyatra.com
                        </div>
                      </div>
                    </button>

                    {/* Admin Login */}
                    <button
                      onClick={() => handleQuickLogin('admin@sikkimyatra.com')}
                      className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-left hover:bg-rose-950/40 transition-all hover:border-rose-500/60 group"
                    >
                      <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-400 group-hover:scale-105 transition-transform">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Login as Admin</div>
                        <div className="text-[11px] text-rose-300/70 font-mono">
                          admin@sikkimyatra.com
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live Connectivity Card (Main User Requirement) */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Full-Stack Health Status</h3>
                  <p className="text-xs text-emerald-300/70">
                    Live end-to-end communication check (Next.js ⟷ Express API ⟷ DB)
                  </p>
                </div>
              </div>

              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                <span>{isFetching ? 'Pinging API...' : 'Ping API Now'}</span>
              </button>
            </div>

            {/* Health Content Render */}
            <div className="mt-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  <p className="mt-3 text-sm text-emerald-300/80">
                    Connecting to Sikkim Yatra Backend API...
                  </p>
                </div>
              ) : isError ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-6 text-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300">Backend Server on Standby</h4>
                      <p className="mt-1 text-xs text-amber-200/80">
                        {error?.message ||
                          'Start Express server using `npm run dev:server` to view live telemetry.'}
                      </p>
                      <div className="mt-3 rounded-lg bg-black/40 p-3 font-mono text-xs text-amber-300">
                        Endpoint:{' '}
                        {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/health
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Status Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-300/70">API Status</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold uppercase text-emerald-400">
                      {health?.status || 'OK'}
                    </p>
                    <span className="text-[11px] text-emerald-400/80">{health?.service}</span>
                  </div>

                  {/* Uptime Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-300/70">Server Uptime</span>
                      <Cpu className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-teal-300">
                      {health?.uptime !== undefined ? `${health.uptime}s` : '0s'}
                    </p>
                    <span className="text-[11px] text-emerald-300/70">
                      Environment: {health?.environment}
                    </span>
                  </div>

                  {/* Database Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-300/70">
                        PostgreSQL (Prisma)
                      </span>
                      <Database className="h-4 w-4 text-sky-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold capitalize text-sky-300">
                      {health?.database?.status || 'Standby'}
                    </p>
                    <span className="text-[11px] text-emerald-300/70">
                      {health?.database?.latencyMs
                        ? `${health.database.latencyMs}ms ping`
                        : 'Schema Ready'}
                    </span>
                  </div>

                  {/* Timestamp Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-300/70">
                        Heartbeat Time
                      </span>
                      <Compass className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="mt-2 font-mono text-sm font-semibold text-amber-300">
                      {health?.timestamp
                        ? new Date(health.timestamp).toLocaleTimeString()
                        : '--:--:--'}
                    </p>
                    <span className="text-[11px] text-emerald-300/70 truncate block">
                      {health?.timestamp
                        ? new Date(health.timestamp).toLocaleDateString()
                        : 'Syncing'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Monorepo & Schema Overview */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* Card 1: Frontend */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">apps/web</h4>
                <p className="text-[11px] text-emerald-300/70">Next.js 15 App Router</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-emerald-200/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>NextAuth.js Credentials & Google OAuth</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>TanStack React Query v5</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>PWA Manifest + Service Worker</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Backend */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-500/20 p-2 text-teal-400">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">apps/server</h4>
                <p className="text-[11px] text-teal-300/70">Node.js Express API</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-emerald-200/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Prisma Client with PostgreSQL models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Seed script with 6 Sikkim regions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Typed /api/v1/health status endpoint</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Database & Models */}
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Prisma Schema</h4>
                <p className="text-[11px] text-amber-300/70">Core Entities</p>
              </div>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-emerald-200/80">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>User (TOURIST / VENDOR / ADMIN)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Place, Vendor, EmergencyContact</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Disaster Alert & SOSRequest tracking</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-900/40 py-6 text-center text-xs text-emerald-400/60 sm:flex-row sm:text-left">
          <p>© 2026 Sikkim Yatra — Offline-First Smart Digital Tourism Platform.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-300">
              Turborepo Pipeline Active
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
