"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"
import { getStoredUser, login as authLogin, logout as authLogout, register as authRegister } from "@/lib/auth"

// Event emitter para sincronizar estado entre componentes
const AUTH_CHANGE_EVENT = "auth-change"

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedUser = getStoredUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  // Escutar mudanças de autenticação de outros componentes
  useEffect(() => {
    if (!mounted) return

    const handleAuthChange = () => {
      const storedUser = getStoredUser()
      setUser(storedUser)
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
  }, [mounted])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await authLogin(email, password)
      setUser(user)
      emitAuthChange()
      return user
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    cpf: string,
    role: "user" | "admin" = "user",
    additionalFields?: {
      phone?: string
      workArea?: string
      educationLevel?: string
    },
  ) => {
    setIsLoading(true)
    try {
      const user = await authRegister(email, password, name, cpf, role, additionalFields)
      setUser(user)
      emitAuthChange()
      return user
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authLogout()
    setUser(null)
    emitAuthChange()
  }

  return {
    user,
    isLoading: !mounted || isLoading,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  }
}
