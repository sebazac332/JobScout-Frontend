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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | undefined>()
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  const { toast } = useToast()
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) router.replace("/auth")
    if (!isAdmin) router.replace("/unauthorized")
  }, [isLoading, user, isAdmin, router])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true)
      try {
        const token = user?.token
        if (!token) return

        const res = await fetch("http://localhost:8000/vagas/admin", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        const transformed: Job[] = data.map((j: any) => ({
          id: j.id,
          title: j.titulo,
          description: j.descricao,
          salary: j.salario,
          type: j.modalidade,
          positions: j.no_vagas,
          companyId: j.empresa_id,
          requirements: Array.isArray(j.competencias)
            ? j.competencias.map((c: any) => c.nome)
            : [],
        }))

        setJobs(transformed)
      } catch (err) {
        console.error("Erro ao buscar vagas:", err)
        toast({ title: "Erro", description: "Não foi possível carregar as vagas", variant: "destructive" })
      } finally {
        setLoadingJobs(false)
      }
    }

    if (!isLoading && user) fetchJobs()
  }, [user, isLoading, toast])

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true)
      try {
        const token = user?.token
        if (!token) return

        const res = await fetch("http://localhost:8000/empresas/admin", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erro ao buscar empresas")

        const data = await res.json()

        const transformed: Company[] = data.map((c: any) => ({
          id: c.id,
          name: c.nome,
          description: c.descricao,
          city: c.cidade,
          cep: c.cep,
          employees: c.no_empregados,
          years: c.anos_func,
          admin_id: c.admin_id,
        }))

        setCompanies(transformed)
      } catch (err) {
        console.error("Erro ao buscar empresas:", err)
        toast({ title: "Erro", description: "Não foi possível carregar as empresas", variant: "destructive" })
      } finally {
        setLoadingCompanies(false)
      }
    }

    if (!isLoading && user) fetchCompanies()
  }, [user, isLoading, toast])

  const handleSave = async (job: Job) => {
  try {
    const token = user?.token
    if (!token) throw new Error("No token available")

    const method = job.id && jobs.some(j => j.id === job.id) ? "PUT" : "POST"
    const url = method === "PUT" ? `http://localhost:8000/vagas/${job.id}` : "http://localhost:8000/vagas"

    const cleanRequirements =
      Array.isArray(job.requirements)
        ? job.requirements.map(r => r.trim()).filter(r => r !== "")
        : []

    console.log("Sending payload to backend:", {
      titulo: job.title,
      descricao: job.description,
      salario: job.salary === "" ? null : job.salary,
      modalidade: job.type,
      no_vagas: job.positions === "" ? null : job.positions,
      empresa_id: job.companyId,
      competencias: cleanRequirements.map((r) => ({ nome: r })),
    })

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        titulo: job.title,
        descricao: job.description,
        salario: job.salary === "" ? null : job.salary,
        modalidade: job.type,
        no_vagas: job.positions === "" ? null : job.positions,
        empresa_id: job.companyId,
        competencias: cleanRequirements.map((r) => ({ nome: r })),
      }),
    })

    if (!res.ok) throw new Error("Erro ao salvar vaga")
    const saved = await res.json()

    const transformed: Job = {
      id: saved.id,
      title: saved.titulo,
      description: saved.descricao,
      salary: saved.salario,
      type: saved.modalidade,
      positions: saved.no_vagas,
      companyId: saved.empresa_id,
      requirements: saved.competencias ? saved.competencias.map((c: any) => c.nome) : [],
    }

    setJobs((prev) =>
      method === "PUT" ? prev.map((j) => (j.id === transformed.id ? transformed : j)) : [...prev, transformed]
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

  const getCompanyName = (companyId: number) =>
    companies.find((c) => c.id === companyId)?.name || "Empresa não encontrada"

  if (showForm) {
    if (loadingCompanies) {
      return (
        <AdminLayout>
          <p>Carregando empresas...</p>
        </AdminLayout>
      )
    }
    if (companies.length === 0) {
      return (
        <AdminLayout>
          <Card>
            <CardContent className="text-center py-16">
              <p>Nenhuma empresa cadastrada. Cadastre uma empresa antes de criar vagas.</p>
            </CardContent>
          </Card>
        </AdminLayout>
      )
    }

    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <JobForm job={editingJob} companies={companies} onSave={handleSave} onCancel={handleCancel} />
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
          <Button
            onClick={() => setShowForm(true)}
            disabled={loadingCompanies || companies.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Vaga
          </Button>
        </div>

        {loadingJobs ? (
          <p>Carregando vagas...</p>
        ) : (
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

            {jobs.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma vaga cadastrada</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Comece criando a primeira vaga de emprego
                  </p>
                  {companies.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-16">
                        <p>Nenhuma empresa cadastrada. Cadastre uma empresa antes de criar vagas.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button onClick={() => setShowForm(true)}>Criar primeira vaga</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
