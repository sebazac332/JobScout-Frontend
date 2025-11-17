"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { CompanyForm } from "@/components/admin/company-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { mockCompanies } from "@/lib/mock-data"
import type { Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(mockCompanies)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | undefined>()
  const { toast } = useToast()

  const handleSave = (company: Company) => {
    setCompanies((prev) => {
      if (editingCompany) {
        return prev.map((c) => (c.id === company.id ? company : c))
      } else {
        return [...prev, company]
      }
    })
    setShowForm(false)
    setEditingCompany(undefined)
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setShowForm(true)
  }

  const handleDelete = (company: Company) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) {
      setCompanies((prev) => prev.filter((c) => c.id !== company.id))
      const index = mockCompanies.findIndex((c) => c.id === company.id)
      if (index !== -1) {
        mockCompanies.splice(index, 1)
      }
      toast({
        title: "Empresa excluída",
        description: `${company.name} foi removida do sistema.`,
      })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCompany(undefined)
  }

  if (showForm) {
    return (
      <AdminLayout>
        <div className="max-w-4xl">
          <CompanyForm company={editingCompany} onSave={handleSave} onCancel={handleCancel} />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Empresas</h1>
            <p className="text-muted-foreground">Gerencie as empresas cadastradas no sistema</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        Ativa
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{company.description}</CardDescription>

                {company.website && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {company.website}
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(company)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {companies.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma empresa cadastrada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comece cadastrando a primeira empresa para criar vagas
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Empresa
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
