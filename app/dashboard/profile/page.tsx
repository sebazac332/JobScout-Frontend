"use client"

import { useState, useEffect } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Shield, Briefcase, BookOpen } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    workArea: "",
    educationLevel: "",
    phone: "",
    cpf: "",
  })

  useEffect(() => {
    if (!user) return
    setFormData({
      name: user.name ?? user.nome ?? "",
      email: user.email ?? "",
      workArea: user.workArea ?? user.area_trabalho ?? "",
      educationLevel: user.educationLevel ?? user.nivel_educacao ?? "",
      phone: user.phone ?? user.telefone ?? "",
      cpf: user.cpf ?? "",
    })
  }, [user])

  if (!user) return null

  // 🔥 Normalized user for viewing section
  const normalizedUser = {
    name: user.name ?? user.nome ?? "",
    email: user.email ?? "",
    workArea: user.workArea ?? user.area_trabalho ?? "",
    educationLevel: user.educationLevel ?? user.nivel_educacao ?? "",
    phone: user.phone ?? user.telefone ?? "",
    cpf: user.cpf ?? "",
    role: user.role,
    id: user.id,
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          area_trabalho: formData.workArea,
          nivel_educacao: formData.educationLevel,
          telefone: formData.phone,
          cpf: formData.cpf,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.detail || "Erro ao atualizar perfil")
      }

      const updatedAPIUser = await res.json()

      const updatedUser = {
        ...user,
        name: updatedAPIUser.name ?? updatedAPIUser.nome,
        email: updatedAPIUser.email,
        workArea: updatedAPIUser.workArea ?? updatedAPIUser.area_trabalho,
        educationLevel: updatedAPIUser.educationLevel ?? updatedAPIUser.nivel_educacao,
        phone: updatedAPIUser.phone ?? updatedAPIUser.telefone,
        cpf: updatedAPIUser.cpf,
      }

      updateUser(updatedUser)
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        workArea: updatedUser.workArea,
        educationLevel: updatedUser.educationLevel,
        phone: updatedUser.phone,
        cpf: updatedUser.cpf,
      })

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })

      setIsEditing(false)
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Não foi possível atualizar o perfil",
        variant: "destructive",
      })
    }
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>Suas informações básicas de conta</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Área de Trabalho */}
                  <div className="space-y-2">
                    <Label htmlFor="workArea">Área de Trabalho</Label>
                    <Input
                      id="workArea"
                      value={formData.workArea}
                      onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
                    />
                  </div>

                  {/* Nível de Educação */}
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Nível de Educação</Label>
                    <Input
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, educationLevel: e.target.value })
                      }
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* CPF */}
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Salvar</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.name || "-"}</p>
                      <p className="text-sm text-muted-foreground">Nome completo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.email || "-"}</p>
                      <p className="text-sm text-muted-foreground">Endereço de email</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.workArea || "-"}</p>
                      <p className="text-sm text-muted-foreground">Área de trabalho</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.educationLevel || "-"}</p>
                      <p className="text-sm text-muted-foreground">Nível de educação</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.phone || "-"}</p>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{normalizedUser.cpf || "-"}</p>
                      <p className="text-sm text-muted-foreground">CPF</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">
                        {normalizedUser.role === "user" ? "Usuário" : "Administrador"}
                      </p>
                      <p className="text-sm text-muted-foreground">Tipo de conta</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sair de Conta</CardTitle>
              <CardDescription>Fazer logout e retornar na tela de login</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                  <div>
                    <p className="font-medium text-red-600">Sair da conta</p>
                    <p className="text-sm text-muted-foreground">Desconectar-se do sistema</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={logout}>
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  )
}