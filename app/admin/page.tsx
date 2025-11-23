"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react"
import { mockCompanies, mockJobs, mockApplications } from "@/lib/mock-data"

export default function AdminDashboard() {

  const router = useRouter()

  const { user, isLoading, isAdmin } = useAuth()

  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/auth")
      return
    }

    if (!isAdmin) {
      router.replace("/unauthorized")
      return
    }

    const fetchData = async () => {
      try {
        const token = user?.token
        if (!token) throw new Error("No token available")

        const [companiesRes, jobsRes, applicationsRes] = await Promise.all([
          fetch("http://localhost:8000/empresas/admin", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/vagas/admin", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:8000/vagas/admin-with-applications", {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ])

        const [companiesData, jobsData, applicationsData] = await Promise.all([
          companiesRes.json(),
          jobsRes.json(),
          applicationsRes.json(),
        ])

        const companiesTransformed = companiesData.map(c => ({
        id: c.id,
        name: c.nome,
        description: c.descricao,
        city: c.cidade,
        employees: c.no_empregados,
        years: c.anos_func,
      }))

      const jobsTransformed = jobsData.map(j => ({
        id: j.id,
        title: j.titulo,
        description: j.descricao,
        modality: j.modalidade,
        salary: j.salario,
        numberOfPositions: j.no_vagas,
        companyId: j.empresa_id,
      }))

      const applicationsFlattened = applicationsData.flatMap(vaga => (vaga.users || []).map(user => ({
        vagaId: vaga.id,
        vagaTitle: vaga.titulo,
        userId: user.id,
        userName: user.nome,
      })))

        setCompanies(companiesTransformed)
        setJobs(jobsTransformed)
        setApplications(applicationsFlattened)
      } catch (err) {
        console.error("Erro ao buscar dados do backend:", err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [isLoading, user, isAdmin, router])

  if (isLoading) {
    return <p>Carregando...</p>
  }

  if (!user || !isAdmin) {
    return null
  }

  const stats = [
    {
      title: "Total de Empresas",
      value: companies.length,
      description: "Empresas cadastradas",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Vagas Ativas",
      value: jobs.length,
      description: "Vagas disponíveis",
      icon: Briefcase,
      color: "text-green-600",
    },
    {
      title: "Candidaturas",
      value: applications.length,
      description: "Total de candidaturas",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Taxa de Conversão",
      value: "Not sure if i will include this",
      description: "Candidaturas aceitas",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema de busca de vagas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Empresas Recentes</CardTitle>
              <CardDescription>Últimas empresas cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies.slice(0, 3).map((company) => (
                  <div key={company.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vagas Recentes</CardTitle>
              <CardDescription>Últimas vagas criadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.salary} • {job.modality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
