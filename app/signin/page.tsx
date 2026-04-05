'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'

type Tab = 'signin' | 'signup'

export default function SignInPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('signin')

  // Sign in fields
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')
  const [siError, setSiError] = useState('')
  const [siLoading, setSiLoading] = useState(false)

  // Sign up fields
  const [suName, setSuName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suError, setSuError] = useState('')
  const [suLoading, setSuLoading] = useState(false)

  const handleSignIn = () => {
    setSiError('')
    if (!siEmail.trim() || !siPassword) { setSiError('Please fill in all fields'); return }
    setSiLoading(true)
    const result = signIn(siEmail.trim(), siPassword)
    setSiLoading(false)
    if (!result.success) { setSiError(result.error ?? 'Sign in failed'); return }
    router.push('/')
  }

  const handleSignUp = () => {
    setSuError('')
    if (!suName.trim() || !suEmail.trim() || !suPassword || !suConfirm) { setSuError('Please fill in all fields'); return }
    if (suPassword !== suConfirm) { setSuError('Passwords do not match'); return }
    if (suPassword.length < 6) { setSuError('Password must be at least 6 characters'); return }
    setSuLoading(true)
    const result = signUp(suEmail.trim(), suPassword, suName.trim())
    setSuLoading(false)
    if (!result.success) { setSuError(result.error ?? 'Sign up failed'); return }
    router.push('/')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: '16px 18px',
    fontSize: 16,
    color: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
    marginBottom: 12,
    WebkitAppearance: 'none',
  }

  return (
    <main style={{
      minHeight: '100dvh', background: '#000',
      display: 'flex', flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '48px 20px 0' }}>
        <button
          onClick={() => router.back()}
          style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0 8px 0 0' }}
        >‹</button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: '#000', border: '1px solid rgba(92,224,208,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#5ce0d0',
          }}>NB</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>NextBody</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, padding: '32px 24px 48px', display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', marginBottom: 32,
          background: '#141414', borderRadius: 14, padding: 4,
        }}>
          {(['signin', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '11px 0',
                borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: 600,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#000' : 'rgba(255,255,255,0.45)',
                transition: 'background 0.18s, color 0.18s',
                fontFamily: 'inherit',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* ── Sign In form ── */}
        {tab === 'signin' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>Sign in to continue your journey</p>

            <input
              type="email"
              placeholder="Email address"
              value={siEmail}
              onChange={e => setSiEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              style={inputStyle}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={siPassword}
              onChange={e => setSiPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              style={{ ...inputStyle, marginBottom: 6 }}
              autoComplete="current-password"
            />

            {siError && (
              <p style={{ fontSize: 13, color: '#f87171', marginBottom: 16, textAlign: 'center' }}>{siError}</p>
            )}

            <div style={{ flex: 1, minHeight: 20 }} />

            <button
              onClick={handleSignIn}
              disabled={siLoading}
              className="btn-teal"
              style={{ marginTop: 24 }}
            >
              {siLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
              Don&apos;t have an account?{' '}
              <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5ce0d0', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
                Create one
              </button>
            </p>
          </div>
        )}

        {/* ── Sign Up form ── */}
        {tab === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Create account</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>Start your transformation today</p>

            <input
              type="text"
              placeholder="Your name"
              value={suName}
              onChange={e => setSuName(e.target.value)}
              style={inputStyle}
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email address"
              value={suEmail}
              onChange={e => setSuEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={suPassword}
              onChange={e => setSuPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={suConfirm}
              onChange={e => setSuConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignUp()}
              style={{ ...inputStyle, marginBottom: 6 }}
              autoComplete="new-password"
            />

            {suError && (
              <p style={{ fontSize: 13, color: '#f87171', marginBottom: 16, textAlign: 'center' }}>{suError}</p>
            )}

            <div style={{ flex: 1, minHeight: 20 }} />

            <button
              onClick={handleSignUp}
              disabled={suLoading}
              className="btn-teal"
              style={{ marginTop: 24 }}
            >
              {suLoading ? 'Creating account…' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
              Already have an account?{' '}
              <button onClick={() => setTab('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5ce0d0', fontWeight: 600, fontSize: 13, fontFamily: 'inherit', padding: 0 }}>
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
