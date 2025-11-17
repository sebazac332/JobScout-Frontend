"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [phone, setPhone] = useState("")
  const [workArea, setWorkArea] = useState("")
  const [educationLevel, setEducationLevel] = useState("")
  const [userType, setUserType] = useState<"user" | "admin">("user")
  const { register, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await register(email, password, name, cpf, userType, {
        phone: userType === "admin" ? phone : undefined,
        workArea: userType === "user" ? workArea : undefined,
        educationLevel: userType === "user" ? educationLevel : undefined,
      })
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo ao sistema de busca de vagas como ${userType === "admin" ? "administrador" : "usuário"}.`,
      })
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Cadastrar</CardTitle>
        <CardDescription>Crie sua conta para buscar vagas de emprego</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de conta</Label>
            <Select value={userType} onValueChange={(value: "user" | "admin") => setUserType(value)}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário (Buscar vagas)</SelectItem>
                <SelectItem value="admin">Administrador (Gerenciar vagas)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          {userType === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Número de telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          )}
          {userType === "user" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workArea">Área de trabalho</Label>
                <Input
                  id="workArea"
                  type="text"
                  value={workArea}
                  onChange={(e) => setWorkArea(e.target.value)}
                  placeholder="Ex: Tecnologia, Marketing, Vendas"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationLevel">Nível de educação</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel} required>
                  <SelectTrigger id="educationLevel">
                    <SelectValue placeholder="Selecione seu nível de educação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                    <SelectItem value="medio">Ensino Médio</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="superior">Ensino Superior</SelectItem>
                    <SelectItem value="pos">Pós-graduação</SelectItem>
                    <SelectItem value="mestrado">Mestrado</SelectItem>
                    <SelectItem value="doutorado">Doutorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onToggleMode}>
            Já tem conta? Faça login
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
