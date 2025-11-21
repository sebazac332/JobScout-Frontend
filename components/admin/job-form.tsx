"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Job, Company } from "@/lib/types"

interface JobFormProps {
  job?: Job
  companies: Company[]
  onSave: (job: Job) => void
  onCancel: () => void
}

export function JobForm({ job, companies, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    salary: job?.salary || 0,
    type: job?.type || "presencial",
    positions: job?.positions || 1,
    companyId: job?.companyId || companies[0]?.id || 0,
  })

  // NEW: requirements state
  const [requirements, setRequirements] = useState<string[]>(job?.requirements || [])
  const [newRequirement, setNewRequirement] = useState("")

  const addRequirement = () => {
    const trimmed = newRequirement.trim()
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements([...requirements, trimmed])
      setNewRequirement("")
    }
  }

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSave({
      id: job?.id || Date.now(),
      ...formData,
      salary: Number(formData.salary),
      positions: Number(formData.positions),
      companyId: Number(formData.companyId),
      requirements,
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{job ? "Editar Vaga" : "Nova Vaga"}</CardTitle>
        <CardDescription>
          {job ? "Atualize os detalhes da vaga" : "Crie uma nova vaga para sua empresa"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* SALARY */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salário *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
              required
            />
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label>Tipo de Vaga *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as Job["type"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="hibrido">Híbrido</SelectItem>
                <SelectItem value="remoto">Remoto</SelectItem>
                <SelectItem value="estagio">Estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* POSITIONS */}
          <div className="space-y-2">
            <Label htmlFor="positions">Número de Vagas *</Label>
            <Input
              id="positions"
              type="number"
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: Number(e.target.value) })}
              required
            />
          </div>

          {/* COMPANY */}
          <div className="space-y-2">
            <Label>Empresa *</Label>
            <Select
              value={formData.companyId.toString()}
              onValueChange={(value) => setFormData({ ...formData, companyId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* REQUIREMENTS */}
          <div className="space-y-2">
            <Label>Requisitos *</Label>

            {/* Add requirement input */}
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar requisito"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
              />
              <Button type="button" onClick={addRequirement}>
                Add
              </Button>
            </div>

            {/* List of requirements */}
            <div className="flex flex-wrap gap-2 pt-2">
              {requirements.map((req) => (
                <div
                  key={req}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm"
                >
                  {req}
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => removeRequirement(req)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <Button type="submit">{job ? "Atualizar" : "Criar Vaga"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}