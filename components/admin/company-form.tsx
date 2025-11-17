"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/lib/types"
import { mockCompanies } from "@/lib/mock-data"
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
    website: company?.website || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCompany: Company = {
        id: company?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        website: formData.website || undefined,
        createdAt: company?.createdAt || new Date().toISOString(),
      }

      if (company) {
        // Atualizar empresa existente
        const index = mockCompanies.findIndex((c) => c.id === company.id)
        if (index !== -1) {
          mockCompanies[index] = newCompany
        }
      } else {
        // Adicionar nova empresa
        mockCompanies.push(newCompany)
      }

      onSave(newCompany)
      toast({
        title: company ? "Empresa atualizada!" : "Empresa criada!",
        description: `${newCompany.name} foi ${company ? "atualizada" : "criada"} com sucesso.`,
      })
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
              placeholder="Ex: TechCorp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a empresa e suas atividades..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://exemplo.com"
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
