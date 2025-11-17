"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { JobForm } from "@/components/admin/job-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Edit, Trash2, MapPin, DollarSign } from "lucide-react"
import { mockJobs, mockCompanies } from "@/lib/mock-data"
import type { Job } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const { toast } = useToast()

  const getCompanyName = (companyId: string) => {
    return mockCompanies.find((c) => c.id === companyId)?.name || "Empresa não encontrada"
  }

  const getJobTypeLabel = (type: string) => {
    const labels = {
      "full-time": "Tempo Integral",
      "part-time": "Meio Período",
      contract: "Contrato",
      remote: "Remoto",
    }
    return labels[type as keyof typeof labels] || type
  }

  const handleSave = (job: Job) => {
    setJobs((prev) => {
      if (editingJob) {
        return prev.map((j) => (j.id === job.id ? job : j))
      } else {
        return [...prev, job]
      }
    })
    setShowForm(false)
    setEditingJob(undefined)
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleDelete = (job: Job) => {
    if (confirm(`Tem certeza que deseja excluir a vaga "${job.title}"?`)) {
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
      const index = mockJobs.findIndex((j) => j.id === job.id)
      if (index !== -1) {
        mockJobs.splice(index, 1)
      }
      toast({
        title: "Vaga excluída",
        description: `${job.title} foi removida do sistema.`,
      })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(undefined)
  }

  if (showForm) {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <JobForm job={editingJob} onSave={handleSave} onCancel={handleCancel} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vagas</h1>
            <p className="text-muted-foreground">Gerencie as vagas de emprego disponíveis</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Vaga
          </Button>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{getCompanyName(job.companyId)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(job)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(job)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {getJobTypeLabel(job.type)}
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {job.salary}
                    </div>
                  )}
                </div>

                {job.requirements.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Requisitos:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((requirement) => (
                        <Badge key={requirement} variant="outline">
                          {requirement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga cadastrada</h3>
              <p className="text-muted-foreground text-center mb-4">Comece criando a primeira vaga de emprego</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Vaga
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
