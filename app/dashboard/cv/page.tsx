"use client"

import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CVForm } from "@/components/user/cv-form"
import { useAuth } from "@/hooks/useAuth"

export default function CVPage() {
  const { user: rawUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <UserLayout>
        <p className="text-muted-foreground">Carregando...</p>
      </UserLayout>
    )
  }

  if (!rawUser) {
    return (
      <UserLayout>
        <p className="text-muted-foreground">Usuário não autenticado.</p>
      </UserLayout>
    )
  }

  // Normalize fields so CVForm and display use the same properties
  const user = {
    id: rawUser.id,
    token: rawUser.token,
    name: rawUser.name || rawUser.nome || "-",
    email: rawUser.email || "-",
    phone: rawUser.phone || rawUser.telefone || "-",
    cpf: rawUser.cpf || "-",
    workArea: rawUser.workArea || rawUser.area_trabalho || "-",
    educationLevel: rawUser.educationLevel || rawUser.nivel_educacao || "-",
  }

  return (
    <UserLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* -------- Informações Pessoais -------- */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Veja seus dados de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <p className="text-lg">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p className="text-lg">{user.cpf}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Área de Trabalho</p>
                <p className="text-lg">{user.workArea}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nível de Educação</p>
                <p className="text-lg">{user.educationLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* -------- CV Form -------- */}
        <CVForm user={user} />
      </div>
    </UserLayout>
  )
}
