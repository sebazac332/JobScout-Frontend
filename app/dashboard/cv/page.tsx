"use client"

import { useEffect, useState } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { Experience, Skill } from "@/lib/types"

export default function CVPage() {
  const { user, token } = useAuth()

  const [experiencias, setExperiencias] = useState<Experiencia[]>([])
  const [competencias, setCompetencias] = useState<Competencia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !token) return

    async function loadData() {
      try {
        const [expRes, compRes] = await Promise.all([
          fetch(`http://localhost:8000/experiencias/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://localhost:8000/competencias/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (expRes.ok) {
          const raw = await expRes.json()

          const converted = raw.map((e: any) => ({
            id: e.id,
            company: e.empresa,
            position: e.cargo,
            years: e.anos,
          }))
          setExperiencias(converted)
        }

        if (compRes.ok) {
          const raw = await compRes.json()

          const converted = raw.map((c: any) => ({
            id: c.id,
            name: c.nome
          }))
          setCompetencias(converted)
        }

      } catch (err) {
        console.error("Erro ao carregar dados do CV:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, token])

  if (loading) {
    return (
      <UserLayout>
        <p className="text-muted-foreground">Carregando...</p>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil Profissional</h1>
          <p className="text-muted-foreground">Visualize suas informações, experiências e competências</p>
        </div>

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
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
              {user?.telefone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-lg">{user.telefone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Competências */}
        <Card>
          <CardHeader>
            <CardTitle>Competências</CardTitle>
          </CardHeader>
          <CardContent>
            {competencias.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {competencias.map((comp) => (
                  <Badge key={comp.id} variant="secondary">
                    {comp.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma competência cadastrada.</p>
            )}
          </CardContent>
        </Card>

        {/* Experiências */}
        <Card>
          <CardHeader>
            <CardTitle>Experiências Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            {experiencias.length > 0 ? (
              <div className="space-y-6">
                {experiencias.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-primary pl-4">
                    <h4 className="font-semibold text-lg">{exp.position}</h4>
                    <p className="text-muted-foreground font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.years} anos
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma experiência cadastrada.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}