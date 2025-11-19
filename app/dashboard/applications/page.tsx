"use client"

import { useState, useEffect } from "react"
import { UserLayout } from "@/components/user/user-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, MapPin, Calendar, Eye } from "lucide-react"
import { mockApplications, mockJobs, mockCompanies } from "@/lib/mock-data"
import type { Application } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [userApplications, setUserApplications] = useState<Application[]>([])

  useEffect(() => {
    if (user) {
      const applications = mockApplications
        .filter((app) => app.userId === user.id)
        .map((app) => ({
          ...app,
          job: mockJobs.find((job) => job.id === app.jobId),
        }))
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())

      setUserApplications(applications)
    }
  }, [user])

  const getCompanyName = (companyId: string) => {
    return mockCompanies.find((c) => c.id === companyId)?.name || "Empresa não encontrada"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "reviewed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "reviewed":
        return "Em análise"
      case "accepted":
        return "Aceita"
      case "rejected":
        return "Rejeitada"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

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
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {userApplications.length} candidatura{userApplications.length !== 1 ? "s" : ""} encontrada
                {userApplications.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6">
              {userApplications.map((application) => {
                const job = application.job
                if (!job) return null

                return (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{getCompanyName(job.companyId)}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Candidatura enviada em {formatDate(application.appliedAt)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

                      {job.requirements.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Requisitos:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 4).map((requirement) => (
                              <Badge key={requirement} variant="outline">
                                {requirement}
                              </Badge>
                            ))}
                            {job.requirements.length > 4 && (
                              <Badge variant="outline">+{job.requirements.length - 4} mais</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalhes
                        </Button>
                      </div>
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
