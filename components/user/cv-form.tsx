"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"
import type { CV, Experience, Education } from "@/lib/types"
import { mockCVs } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

interface CVFormProps {
  cv?: CV
  onSave: (cv: CV) => void
}

export function CVForm({ cv, onSave }: CVFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: cv?.name || user?.name || "",
    email: cv?.email || user?.email || "",
    phone: cv?.phone || "",
    summary: cv?.summary || "",
    experience: cv?.experience || [],
    education: cv?.education || [],
    skills: cv?.skills || [],
  })

  const [newSkill, setNewSkill] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCV: CV = {
        id: cv?.id || Date.now().toString(),
        userId: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        summary: formData.summary,
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        updatedAt: new Date().toISOString(),
      }

      if (cv) {
        const index = mockCVs.findIndex((c) => c.id === cv.id)
        if (index !== -1) {
          mockCVs[index] = newCV
        }
      } else {
        mockCVs.push(newCV)
      }

      onSave(newCV)
      toast({
        title: cv ? "CV atualizado!" : "CV criado!",
        description: "Suas informações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o CV.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setFormData({
      ...formData,
      experience: [...formData.experience, newExp],
    })
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...formData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, experience: updated })
  }

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    })
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    }
    setFormData({
      ...formData,
      education: [...formData.education, newEdu],
    })
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...formData.education]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, education: updated })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{cv ? "Editar CV" : "Criar CV"}</CardTitle>
          <CardDescription>Mantenha suas informações atualizadas para se candidatar às vagas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Resumo profissional</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
                  rows={4}
                />
              </div>
            </div>

            {/* Habilidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Habilidades</h3>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ex: React, TypeScript..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experiência */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Experiência Profissional</h3>
                <Button type="button" variant="outline" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              {formData.experience.map((exp, index) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Experiência {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          placeholder="Nome da empresa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(index, "position", e.target.value)}
                          placeholder="Seu cargo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de início</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Data de fim</Label>
                        <Input
                          type="date"
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          placeholder="Deixe vazio se atual"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Descrição</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, "description", e.target.value)}
                        placeholder="Descreva suas responsabilidades e conquistas..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Educação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Educação</h3>
                <Button type="button" variant="outline" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              {formData.education.map((edu, index) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Educação {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Instituição</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, "institution", e.target.value)}
                          placeholder="Nome da instituição"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grau</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          placeholder="Ex: Bacharelado, Mestrado..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Área de estudo</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(index, "field", e.target.value)}
                          placeholder="Ex: Ciência da Computação"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ano de conclusão</Label>
                        <Input
                          type="date"
                          value={edu.endDate || ""}
                          onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : cv ? "Atualizar CV" : "Criar CV"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
