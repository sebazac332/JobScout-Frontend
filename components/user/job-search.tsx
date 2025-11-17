"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Briefcase, Building2 } from "lucide-react"
import { mockJobs, mockCompanies } from "@/lib/mock-data"
import type { Job } from "@/lib/types"

interface JobSearchProps {
  onApply: (job: Job) => void
}

export function JobSearch({ onApply }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

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

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      if (!job.isActive) return false

      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some((req) => req.toLowerCase().includes(searchTerm.toLowerCase())) ||
        getCompanyName(job.companyId).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLocation =
        locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase())

      const matchesType = typeFilter === "all" || job.type === typeFilter

      return matchesSearch && matchesLocation && matchesType
    })
  }, [searchTerm, locationFilter, typeFilter])

  const uniqueLocations = Array.from(new Set(mockJobs.map((job) => job.location)))
  const jobTypes = [
    { value: "full-time", label: "Tempo Integral" },
    { value: "part-time", label: "Meio Período" },
    { value: "contract", label: "Contrato" },
    { value: "remote", label: "Remoto" },
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
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as localizações</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filteredJobs.length} vaga{filteredJobs.length !== 1 ? "s" : ""} encontrada
            {filteredJobs.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground text-center">
                Tente ajustar os filtros de busca para encontrar mais oportunidades
              </p>
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
                    <Button onClick={() => onApply(job)}>Candidatar-se</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>

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
                        {job.requirements.slice(0, 6).map((requirement) => (
                          <Badge key={requirement} variant="secondary">
                            {requirement}
                          </Badge>
                        ))}
                        {job.requirements.length > 6 && (
                          <Badge variant="outline">+{job.requirements.length - 6} mais</Badge>
                        )}
                      </div>
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
