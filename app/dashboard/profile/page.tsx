"use client"

import { useState, useEffect } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Shield, Phone, Briefcase, BookOpen } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    workArea: "",
    educationLevel: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.nome,
        email: user.email,
        phone: user.telefone || "",
        workArea: user.area_trabalho || "",
        educationLevel: user.nivel_educacao || "",
      })
    }
  }, [user])

  if (!user) return null

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
          telefone: formData.phone,
          area_trabalho: formData.workArea,
          nivel_educacao: formData.educationLevel,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.detail || "Erro ao atualizar perfil")
      }

      const updatedUser = await res.json()
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
          {/* Informações Pessoais */}
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workArea">Área de Trabalho</Label>
                    <Input
                      id="workArea"
                      value={formData.workArea}
                      onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="educationLevel">Nível de Educação</Label>
                    <Input
                      id="educationLevel"
                      value={formData.educationLevel}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
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
                      <p className="font-medium">{user.nome}</p>
                      <p className="text-sm text-muted-foreground">Nome completo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">Endereço de email</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.telefone || "-"}</p>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.area_trabalho || "-"}</p>
                      <p className="text-sm text-muted-foreground">Área de trabalho</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.nivel_educacao || "-"}</p>
                      <p className="text-sm text-muted-foreground">Nível de educação</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{user.role === "user" ? "Usuário" : "Administrador"}</p>
                      <p className="text-sm text-muted-foreground">Tipo de conta</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações de Conta */}
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