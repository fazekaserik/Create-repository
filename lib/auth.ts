'use client'

import { useState, useEffect } from 'react'

const USERS_KEY = 'nextbody_users'
const AUTH_KEY  = 'nextbody_auth'
const AUTH_EVENT = 'nextbody_auth_change'

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: string
}

interface StoredUser extends AuthUser {
  passwordHash: string
}

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') } catch { return [] }
}

function readSession(): AuthUser | null {
  try { const r = localStorage.getItem(AUTH_KEY); return r ? JSON.parse(r) : null } catch { return null }
}

function emit() {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function signUp(email: string, password: string, name: string): { success: boolean; error?: string } {
  const users = readUsers()
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' }
  }
  const stored: StoredUser = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    email: email.trim(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    passwordHash: btoa(password),
  }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, stored]))
  const { passwordHash: _, ...session } = stored
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  emit()
  return { success: true }
}

export function signIn(email: string, password: string): { success: boolean; error?: string } {
  const users = readUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { success: false, error: 'No account found with that email' }
  if (user.passwordHash !== btoa(password)) return { success: false, error: 'Incorrect password' }
  const { passwordHash: _, ...session } = user
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  emit()
  return { success: true }
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY)
  emit()
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setUser(readSession())
    setMounted(true)
    const handler = () => setUser(readSession())
    window.addEventListener(AUTH_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(AUTH_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return { user, isLoggedIn: mounted && !!user, mounted }
}
