"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Job, Company } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

interface JobFormProps {
  job?: Job
  companies: Company[]
  onSave: (job: Job) => void
  onCancel: () => void
}

export function JobForm({ job, companies, onSave, onCancel }: JobFormProps) {
  const { user } = useAuth()
  const token = user?.token
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: 0,
    type: "presencial",
    positions: 1,
    companyId: 0,
  })

  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState("")

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        salary: job.salary,
        type: job.type,
        positions: job.positions,
        companyId: job.companyId,
      })
      setRequirements(job.requirements || [])
    } else if (companies.length > 0) {
      setFormData((prev) => ({
        ...prev,
        companyId: companies[0].id,
      }))
    }
  }, [job, companies])

  const addRequirement = async () => {
    const trimmed = newRequirement.trim()
    if (!trimmed || requirements.includes(trimmed)) return

    if (job?.id && token) {
      try {
        const res = await fetch(`http://localhost:8000/vagas/${job.id}/competencias`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome: trimmed }),
        })
        if (!res.ok) throw new Error("Erro ao adicionar competência")
      } catch (err) {
        console.error(err)
        toast({ title: "Erro", description: "Não foi possível adicionar requisito", variant: "destructive" })
        return
      }
    }

    setRequirements([...requirements, trimmed])
    setNewRequirement("")
  }

  const removeRequirement = async (req: string) => {
    if (job?.id && token) {
      try {
        const res = await fetch(`http://localhost:8000/vagas/${job.id}/competencias/${req}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erro ao remover competência")
      } catch (err) {
        console.error(err)
        toast({ title: "Erro", description: "Não foi possível remover requisito", variant: "destructive" })
        return
      }
    }

    setRequirements(requirements.filter((r) => r !== req))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!job && requirements.length === 0) {
      toast({ title: "Erro", description: "Adicione pelo menos um requisito", variant: "destructive" })
      return
    }

    const cleanRequirements = requirements
      .map(r => r.trim())
      .filter(r => r !== "")

    onSave({
      id: job?.id || Date.now(),
      ...formData,
      salary: Number(formData.salary),
      positions: Number(formData.positions),
      companyId: Number(formData.companyId),
      requirements: cleanRequirements,
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
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar requisito"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addRequirement()
                  }
                }}
              />
              <Button type="button" onClick={addRequirement} disabled={!newRequirement.trim()}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {requirements.map((req) => (
                <div key={req} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                  {req}
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeRequirement(req)} />
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
