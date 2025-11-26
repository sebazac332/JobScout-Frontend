"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { CompanyForm } from "@/components/admin/company-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { mockCompanies } from "@/lib/mock-data"
import type { Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | undefined>()
  const { toast } = useToast()
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

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
  }, [isLoading, user, isAdmin, router])

  useEffect(() => {
  
  if (isLoading) return
  if (!user?.token) return

  const fetchCompanies = async () => {
    try {
      const token = user?.token
      if (!token) return

      const res = await fetch("http://localhost:8000/empresas/admin", {
      headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json()

      const transformed = data
        .map((c: any) => ({
          id: c.id,
          name: c.nome,
          description: c.descricao,
          city: c.cidade,
          cep: c.cep,
          employees: c.no_empregados,
          years: c.anos_func,
          admin_id: c.admin_id
        }))

        setCompanies(transformed)
      } catch (err) {
        console.error("Erro ao buscar empresas:", err)
        toast({ title: "Erro", description: "Não foi possível carregar as empresas", variant: "destructive" })
      }
    }

    fetchCompanies()
  }, [user, isLoading])

  const refreshCompanies = async () => {
    try {
      const token = user?.token
      if (!token) return

      const res = await fetch("http://localhost:8000/empresas/admin", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()

      const transformed = data.map((c: any) => ({
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
      toast({
        title: "Erro",
        description: "Não foi possível carregar as empresas",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (company: Company) => {
    try {
      const token = user?.token
      if (!token) throw new Error("Token não encontrado")

      const decoded: any = jwtDecode(token)
      const adminId = decoded.id

      const method = editingCompany ? "PUT" : "POST"
      const url = editingCompany
        ? `http://localhost:8000/empresas/${company.id}`
        : "http://localhost:8000/empresas"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: company.name,
          descricao: company.description,
          cidade: company.city,
          cep: company.cep,
          no_empregados: company.employees,
          anos_func: company.years,
          admin_id: adminId,
        }),
      })

    if (!res.ok) throw new Error("Erro ao salvar empresa")

    await refreshCompanies()

    setShowForm(false)
    setEditingCompany(undefined)
      toast({ title: "Sucesso", description: "Empresa salva com sucesso" })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível salvar a empresa", variant: "destructive" })
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setShowForm(true)
  }

  const handleDelete = async (company: Company) => {
    if (!confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) return

    try {
      const token = user?.token
      if (!token) throw new Error("Token não encontrado")
      const res = await fetch(`http://localhost:8000/empresas/${company.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Erro ao excluir empresa")

      await refreshCompanies()
      toast({ title: "Empresa excluída", description: `${company.name} foi removida do sistema.` })
    } catch (err) {
      console.error(err)
      toast({ title: "Erro", description: "Não foi possível excluir a empresa", variant: "destructive" })
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
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{company.description}</CardDescription>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>Cidade: {company.city}</Badge>
                  <Badge>CEP: {company.cep}</Badge>
                  <Badge>Empregados: {company.employees}</Badge>
                  <Badge>Anos: {company.years}</Badge>
                </div>

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