"use client"

import type { User } from "./types"

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem("currentUser")
  return stored ? JSON.parse(stored) : null
}

export const setStoredUser = (user: User | null) => {
  if (typeof window === "undefined") return

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const login = async (email: string, password: string): Promise<User> => {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const res = await fetch("http://localhost:8000/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || "Erro ao efetuar login")
  }

  const { access_token } = await res.json()

  const verifyRes = await fetch(
    `http://localhost:8000/auth/verify?token=${access_token}`
  )
  const verifyData = await verifyRes.json()

  const role = verifyData.role as "admin" | "user"

  const profileRes = await fetch(
    role === "admin"
      ? "http://localhost:8000/admins/me"
      : "http://localhost:8000/users/me",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )

  if (!profileRes.ok) {
    throw new Error("Erro ao carregar perfil do usuário")
  }

  const profile = await profileRes.json()

  const fullUser: User = {
    ...profile,
    role,
    token: access_token,
  }

  setStoredUser(fullUser)
  return fullUser
}

export const logout = () => {
  setStoredUser(null)
}

export const register = async (
  email: string,
  password: string,
  name: string,
  cpf: string,
  role: "user" | "admin" = "user",
  additionalFields?: {
    phone?: string
    workArea?: string
    educationLevel?: string
  }
): Promise<User> => {
  const url =
    role === "admin"
      ? "http://localhost:8000/admins"
      : "http://localhost:8000/users"

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: name,
      email,
      cpf,
      password,
      ...additionalFields,
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || "Erro ao registrar usuário")
  }

  return login(email, password)
}