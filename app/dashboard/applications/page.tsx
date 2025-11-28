"use client"

import { useState, useEffect } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { Job } from "@/lib/types"

type ApplicationAPI = {
  app: {
    id: number
    vaga_id: number
  }
  job: {
    id: number
    titulo: string
    descricao: string
    salario: number
    modalidade: string
    no_vagas: number
    competencias?: any[]
    empresa_id: number
  }
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [userApplications, setUserApplications] = useState<(ApplicationAPI["app"] & { job: Job })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = "https://jobscout-main.up.railway.app"

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const res = await fetch(`${API_URL}/users/${user.id}/applications`)
        const data: ApplicationAPI[] = await res.json()

        console.log("RAW APPLICATION DATA:", data)

        const appsWithJobs = data
          .map(({ app, job }) => {
            const mappedJob: Job = {
              id: job.id,
              title: job.titulo,
              description: job.descricao,
              salary: job.salario,
              type: job.modalidade as "presencial" | "hibrido" | "remoto" | "estagio",
              positions: job.no_vagas,
              companyId: job.empresa_id,
              requirements: Array.isArray(job.competencias)
                ? job.competencias
                : typeof job.competencias  === "string"
                ? (job.competencias as string).split(",").map((s) => s.trim())
                : [],
            }

            return { ...app, job: mappedJob }
          })

        setUserApplications(appsWithJobs)
      } catch (err) {
        console.error("Erro ao carregar candidaturas:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (!user) return <p className="text-muted-foreground">Usuário não autenticado.</p>

  if (isLoading)
    return (
      <UserLayout>
        <p className="text-muted-foreground">Carregando...</p>
      </UserLayout>
    )

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Minhas Candidaturas</h1>
          <p className="text-muted-foreground">Acompanhe o status das suas candidaturas</p>
        </div>

        {userApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma candidatura encontrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades disponíveis!
              </p>
              <Button onClick={() => (window.location.href = "/dashboard")}>Buscar Vagas</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              {userApplications.length} candidatura
              {userApplications.length !== 1 ? "s" : ""} encontrada
              {userApplications.length !== 1 ? "s" : ""}
            </p>

            <div className="grid gap-6">
              {userApplications.map((application) => {
                const { job } = application

                return (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{job.type}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                      {job.requirements?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Requisitos:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 4).map((req) => (
                              <Badge key={req} variant="outline">
                                {req}
                              </Badge>
                            ))}
                            {job.requirements.length > 4 && (
                              <Badge variant="outline">+{job.requirements.length - 4} mais</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}