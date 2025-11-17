"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Briefcase, Users, TrendingUp } from "lucide-react"
import { mockCompanies, mockJobs, mockApplications } from "@/lib/mock-data"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total de Empresas",
      value: mockCompanies.length,
      description: "Empresas cadastradas",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Vagas Ativas",
      value: mockJobs.filter((job) => job.isActive).length,
      description: "Vagas disponíveis",
      icon: Briefcase,
      color: "text-green-600",
    },
    {
      title: "Candidaturas",
      value: mockApplications.length,
      description: "Total de candidaturas",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Taxa de Conversão",
      value: "12%",
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
                {mockCompanies.slice(0, 3).map((company) => (
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
                {mockJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.location} • {job.type}
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
