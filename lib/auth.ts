"use client"

import type { User } from "./types"
import { mockUsers } from "./mock-data"

export interface AuthState {
  user: User | null
  isLoading: boolean
}

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
  console.log("[v0] Tentando login com email:", email)
  console.log(
    "[v0] Usuários disponíveis:",
    mockUsers.map((u) => u.email),
  )

  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)

  console.log("[v0] Usuário encontrado:", user)

  if (!user) {
    console.log("[v0] Erro: Usuário não encontrado")
    throw new Error("Usuário não encontrado")
  }

  // Em um app real, verificaríamos a senha
  setStoredUser(user)
  console.log("[v0] Usuário armazenado no localStorage")
  return user
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
  },
): Promise<User> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Email já cadastrado")
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    cpf,
    role,
    ...(role === "admin" && { phone: additionalFields?.phone }),
    ...(role === "user" && {
      workArea: additionalFields?.workArea,
      educationLevel: additionalFields?.educationLevel,
    }),
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  setStoredUser(newUser)
  return newUser
}
