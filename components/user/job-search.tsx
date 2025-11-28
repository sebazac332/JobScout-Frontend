"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, DollarSign, Briefcase, Building2 } from "lucide-react"
import type { Job } from "@/lib/types"

interface JobSearchProps {
  userId: number
  onApply: (job: Job) => void
}

export function JobSearch({ userId, onApply }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [userCompetencias, setUserCompetencias] = useState<string[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])

  const fetchJobs = async () => {
    const resJobs = await fetch("http://localhost:8000/vagas")
    const resCompanies = await fetch("http://localhost:8000/empresas")
    const resCompetencias = await fetch(`http://localhost:8000/users/${userId}/competencias`)
    const resApplications = await fetch(`http://localhost:8000/users/${userId}/applications`)

    const jobsData = await resJobs.json()
    const companiesData = await resCompanies.json()
    const competenciasData = await resCompetencias.json()
    const applicationsData = await resApplications.json()

    setAppliedJobs(
      applicationsData.map((a: any) => a.vaga?.id).filter((id: number | undefined): id is number => !!id)
    )

    setUserCompetencias(competenciasData.map((c: any) => c.nome))

    const transformedJobs = jobsData.map((vaga: any) => ({
      id: vaga.id,
      title: vaga.titulo,
      description: vaga.descricao,
      salary: vaga.salario,
      type: vaga.modalidade,
      companyId: Number(vaga.empresa_id),
      requirements: vaga.competencias?.map((c: any) => c.nome) || [],
    }))

    setJobs(transformedJobs)
    setCompanies(companiesData)
  }


  useEffect(() => {
    fetchJobs()
  }, [])

  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.nome || "Empresa não encontrada"
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getCompanyName(job.companyId).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || job.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter, jobs, companies])

  const jobTypes = [
    { value: "presencial", label: "Presencial" },
    { value: "hibrido", label: "Híbrido" },
    { value: "remoto", label: "Remoto" },
    { value: "estagio", label: "Estágio" },
  ]

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Vagas
          </CardTitle>
          <CardDescription>Encontre oportunidades que combinam com seu perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Buscar por cargo, empresa ou habilidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{getCompanyName(job.companyId)}</span>
                      </div>
                    </div>
                    {appliedJobs.includes(job.id) ? (
                      <Button disabled className="bg-green-600 hover:bg-green-600">
                        Candidatado ✓
                      </Button>
                    ) : (
                      <Button onClick={() => onApply(job)}>
                        Candidatar-se
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {job.salary}
                      </div>
                    )}
                  </div>
                  {job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 6).map((req) => (
                        <Badge key={req} variant={userCompetencias.includes(req) ? "default" : "secondary"}>
                          {req}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
