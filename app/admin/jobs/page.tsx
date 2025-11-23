"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { JobForm } from "@/components/admin/job-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, Edit, Trash2, MapPin, DollarSign } from "lucide-react"
import type { Job, Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const { toast } = useToast()
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) router.replace("/auth")
    if (!isAdmin) router.replace("/unauthorized")
  }, [isLoading, user, isAdmin, router])

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = user?.token
      if (!token) return

      const jobsRes = await fetch("http://localhost:8000/vagas/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const jobsData = await jobsRes.json()

      const transformedJobs: Job[] = jobsData.map((j: any) => ({
        id: j.id,
        title: j.titulo,
        description: j.descricao,
        salary: j.salario,
        type: j.modalidade,
        positions: j.no_vagas,
        companyId: j.empresa_id,
        requirements: j.competencias ? j.competencias.map((c: any) => c.nome) : [],
      }))

      setJobs(transformedJobs)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
      toast({ title: "Erro", description: "Não foi possível carregar os dados", variant: "destructive" })
    }
  }

  fetchData()
  }, [user, isLoading, isAdmin, toast])


  const handleSave = async (job: Job) => {
    try {
      const token = user?.token
      if (!token) throw new Error("No token available")

      const method = editingJob ? "PUT" : "POST"
      const url = editingJob
        ? `http://localhost:8000/vagas/${job.id}`
        : "http://localhost:8000/vagas"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          titulo: job.title,
          descricao: job.description,
          salario: job.salary,
          modalidade: job.type,
          no_vagas: job.positions,
          empresa_id: job.companyId,
          competencias: job.requirements.map((r) => ({ nome: r })),
        }),
      })

      if (!res.ok) throw new Error("Erro ao salvar vaga")
      const savedJob = await res.json()

      const transformed: Job = {
        id: savedJob.id,
        title: savedJob.titulo,
        description: savedJob.descricao,
        salary: savedJob.salario,
        type: savedJob.modalidade,
        positions: savedJob.no_vagas,
        companyId: savedJob.empresa_id,
        requirements: savedJob.competencias ? savedJob.competencias.map((c: any) => c.nome) : [],
      }

      setJobs((prev) =>
        editingJob ? prev.map((j) => (j.id === transformed.id ? transformed : j)) : [...prev, transformed]
      )
      setShowForm(false)
      setEditingJob(undefined)
      toast({ title: "Sucesso", description: "Vaga salva com sucesso" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível salvar a vaga", variant: "destructive" })
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setShowForm(true)
  }

  const handleDelete = async (job: Job) => {
    if (!confirm(`Tem certeza que deseja excluir a vaga "${job.title}"?`)) return
    try {
      const token = user?.token
      if (!token) throw new Error("No token available")
      const res = await fetch(`http://localhost:8000/vagas/${job.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Erro ao excluir vaga")
      setJobs((prev) => prev.filter((j) => j.id !== job.id))
      toast({ title: "Vaga excluída", description: `${job.title} foi removida.` })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível excluir a vaga", variant: "destructive" })
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
          <JobForm job={editingJob} companies={companies} onSave={handleSave} onCancel={handleCancel} />
        </div>
      </AdminLayout>
    )
  }

  const getCompanyName = (companyId: number) => companies.find((c) => c.id === companyId)?.name || "Empresa não encontrada"

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
                      <Badge variant="default">Ativa</Badge>
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

                <div className="flex gap-4 text-sm mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {job.type} • <DollarSign className="h-4 w-4 text-muted-foreground" /> {job.salary}
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.requirements.map((req, idx) => (
                      <Badge key={idx} variant="secondary">
                        {req}
                      </Badge>
                    ))}
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