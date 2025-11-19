"use client"

import { useState, useEffect } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { CVForm } from "@/components/user/cv-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Edit, Plus } from "lucide-react"
import { mockCVs } from "@/lib/mock-data"
import type { CV } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"

export default function CVPage() {
  const { user } = useAuth()
  const [userCV, setUserCV] = useState<CV | undefined>()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) {
      const cv = mockCVs.find((cv) => cv.userId === user.id)
      setUserCV(cv)
    }
  }, [user])

  const handleSave = (cv: CV) => {
    setUserCV(cv)
    setShowForm(false)
  }

  if (showForm) {
    return (
      <UserLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{userCV ? "Editar CV" : "Criar CV"}</h1>
              <p className="text-muted-foreground">
                {userCV ? "Atualize suas informações" : "Crie seu currículo para se candidatar às vagas"}
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
          </div>

          <CVForm cv={userCV} onSave={handleSave} />
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meu CV</h1>
            <p className="text-muted-foreground">Gerencie suas informações profissionais</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            {userCV ? (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar CV
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar CV
              </>
            )}
          </Button>
        </div>

        {userCV ? (
          <div className="max-w-4xl space-y-6">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="text-lg">{userCV.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{userCV.email}</p>
                  </div>
                  {userCV.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-lg">{userCV.phone}</p>
                    </div>
                  )}
                </div>
                {userCV.summary && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Resumo Profissional</p>
                    <p className="text-muted-foreground">{userCV.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Habilidades */}
            {userCV.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Habilidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userCV.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experiência */}
            {userCV.experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiência Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userCV.experience.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold text-lg">{exp.position}</h4>
                        <p className="text-muted-foreground font-medium">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {exp.startDate} - {exp.endDate || "Atual"}
                        </p>
                        {exp.description && <p className="text-muted-foreground">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educação */}
            {userCV.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Educação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userCV.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="font-semibold">
                          {edu.degree} em {edu.field}
                        </h4>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        {edu.endDate && <p className="text-sm text-muted-foreground">Concluído em {edu.endDate}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum CV cadastrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crie seu currículo para se candidatar às vagas disponíveis
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Meu CV
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  )
}
