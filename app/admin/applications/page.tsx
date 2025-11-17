"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Building2, Calendar, Eye, CheckCircle, XCircle } from "lucide-react"
import { mockApplications, mockJobs, mockCompanies, mockUsers, mockCVs } from "@/lib/mock-data"
import type { Application } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const enrichedApplications = mockApplications
      .map((app) => ({
        ...app,
        job: mockJobs.find((job) => job.id === app.jobId),
        user: mockUsers.find((user) => user.id === app.userId),
        cv: mockCVs.find((cv) => cv.id === app.cvId),
      }))
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())

    setApplications(enrichedApplications)
  }, [])

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

  const updateApplicationStatus = (applicationId: string, newStatus: "reviewed" | "accepted" | "rejected") => {
    setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))

    // Atualizar no mock data
    const appIndex = mockApplications.findIndex((app) => app.id === applicationId)
    if (appIndex !== -1) {
      mockApplications[appIndex].status = newStatus
    }

    const application = applications.find((app) => app.id === applicationId)
    toast({
      title: "Status atualizado",
      description: `Candidatura de ${application?.user?.name} foi marcada como ${getStatusLabel(newStatus).toLowerCase()}.`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredApplications = applications.filter((app) => statusFilter === "all" || app.status === statusFilter)

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) => app.status === "reviewed").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Candidaturas</h1>
          <p className="text-muted-foreground">Gerencie as candidaturas recebidas</p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reviewed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aceitas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="reviewed">Em análise</SelectItem>
                  <SelectItem value="accepted">Aceita</SelectItem>
                  <SelectItem value="rejected">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma candidatura encontrada</h3>
              <p className="text-muted-foreground text-center">
                {statusFilter === "all"
                  ? "Ainda não há candidaturas no sistema"
                  : `Não há candidaturas com status "${getStatusLabel(statusFilter).toLowerCase()}"`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredApplications.length} candidatura{filteredApplications.length !== 1 ? "s" : ""} encontrada
                {filteredApplications.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6">
              {filteredApplications.map((application) => {
                const job = application.job
                const user = application.user
                const cv = application.cv
                if (!job || !user) return null

                return (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusLabel(application.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{getCompanyName(job.companyId)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(application.appliedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Candidato</h4>
                          <div className="space-y-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {cv?.phone && <p className="text-sm text-muted-foreground">{cv.phone}</p>}
                          </div>
                          {cv?.summary && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-1">Resumo:</p>
                              <p className="text-sm text-muted-foreground line-clamp-3">{cv.summary}</p>
                            </div>
                          )}
                          {cv?.skills && cv.skills.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Habilidades:</p>
                              <div className="flex flex-wrap gap-1">
                                {cv.skills.slice(0, 5).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {cv.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{cv.skills.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Ações</h4>
                          <div className="space-y-2">
                            {application.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateApplicationStatus(application.id, "reviewed")}
                                  className="w-full"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Marcar como Em Análise
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateApplicationStatus(application.id, "accepted")}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aceitar Candidatura
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(application.id, "rejected")}
                                  className="w-full"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeitar Candidatura
                                </Button>
                              </>
                            )}
                            {application.status === "reviewed" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateApplicationStatus(application.id, "accepted")}
                                  className="w-full bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aceitar Candidatura
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(application.id, "rejected")}
                                  className="w-full"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeitar Candidatura
                                </Button>
                              </>
                            )}
                            {(application.status === "accepted" || application.status === "rejected") && (
                              <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">
                                  Candidatura {application.status === "accepted" ? "aceita" : "rejeitada"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
