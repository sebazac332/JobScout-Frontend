"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Job } from "@/lib/types"
import { mockJobs, mockCompanies } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface JobFormProps {
  job?: Job
  onSave: (job: Job) => void
  onCancel: () => void
}

export function JobForm({ job, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    salary: job?.salary || "",
    location: job?.location || "",
    type: job?.type || ("full-time" as const),
    companyId: job?.companyId || "",
    requirements: job?.requirements || [],
  })
  const [newRequirement, setNewRequirement] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newJob: Job = {
        id: job?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        salary: formData.salary || undefined,
        location: formData.location,
        type: formData.type,
        companyId: formData.companyId,
        createdAt: job?.createdAt || new Date().toISOString(),
        isActive: job?.isActive ?? true,
      }

      if (job) {
        // Atualizar vaga existente
        const index = mockJobs.findIndex((j) => j.id === job.id)
        if (index !== -1) {
          mockJobs[index] = newJob
        }
      } else {
        // Adicionar nova vaga
        mockJobs.push(newJob)
      }

      onSave(newJob)
      toast({
        title: job ? "Vaga atualizada!" : "Vaga criada!",
        description: `${newJob.title} foi ${job ? "atualizada" : "criada"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a vaga.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      })
      setNewRequirement("")
    }
  }

  const removeRequirement = (requirement: string) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((r) => r !== requirement),
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{job ? "Editar Vaga" : "Nova Vaga"}</CardTitle>
        <CardDescription>
          {job ? "Atualize as informações da vaga" : "Cadastre uma nova vaga de emprego"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Empresa *</Label>
            <Select
              value={formData.companyId}
              onValueChange={(value) => setFormData({ ...formData, companyId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da vaga *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Desenvolvedor Frontend React"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as responsabilidades e o que a empresa oferece..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: São Paulo, SP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Tempo Integral</SelectItem>
                  <SelectItem value="part-time">Meio Período</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="remote">Remoto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salário</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Ex: R$ 8.000 - R$ 12.000"
            />
          </div>

          <div className="space-y-2">
            <Label>Requisitos</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Ex: React, TypeScript..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement}>
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requirements.map((requirement) => (
                <Badge key={requirement} variant="secondary" className="flex items-center gap-1">
                  {requirement}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeRequirement(requirement)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : job ? "Atualizar" : "Criar Vaga"}
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
