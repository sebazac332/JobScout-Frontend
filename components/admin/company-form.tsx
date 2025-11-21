"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface CompanyFormProps {
  company?: Company
  onSave: (company: Company) => void
  onCancel: () => void
}

export function CompanyForm({ company, onSave, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    description: company?.description || "",
    city: company?.city || "",
    cep: company?.cep || "",
    employees: company?.employees?.toString() || "",
    years: company?.years?.toString() || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const savedCompany: Company = {
        id: company?.id || 0,
        name: formData.name,
        description: formData.description,
        city: formData.city,
        cep: formData.cep,
        employees: Number(formData.employees),
        years: Number(formData.years),
        admin_id: 0,
      }

      onSave(savedCompany)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a empresa.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{company ? "Editar Empresa" : "Nova Empresa"}</CardTitle>
        <CardDescription>
          {company ? "Atualize as informações da empresa" : "Cadastre uma nova empresa no sistema"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employees">Número de Empregados *</Label>
            <Input
              id="employees"
              type="number"
              value={formData.employees}
              onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Anos de Funcionamento *</Label>
            <Input
              id="years"
              type="number"
              value={formData.years}
              onChange={(e) => setFormData({ ...formData, years: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : company ? "Atualizar" : "Criar Empresa"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}