"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import type { Experience, Skill } from "@/lib/types"

function mapExperienceFromBackend(data: any): Experience {
  return {
    id: String(data.id),
    company: data.empresa,
    position: data.cargo,
    years: data.anos,
  }
}

function mapExperienceToBackend(exp: Experience, userId: string) {
  return {
    empresa: exp.company,
    cargo: exp.position,
    anos: exp.years,
    user_id: Number(userId),
  }
}

function mapSkillFromBackend(data: any): Skill {
  return {
    id: data.id,
    name: data.nome,
  }
}

function mapSkillToBackend(skill: Skill) {
  return { nome: skill.name }
}

export function CVForm() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [experiencias, setExperiencias] = useState<Experience[]>([])
  const [competencias, setCompetencias] = useState<Skill[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const apiUrl = "http://localhost:8000"

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  })

  useEffect(() => {
    if (!user?.token) return

    async function fetchData() {
      try {
        const headers = getAuthHeaders()

        const [expRes, compRes] = await Promise.all([
          fetch(`${apiUrl}/experiencias/user/${user.id}`, { headers }),
          fetch(`${apiUrl}/competencias/user/${user.id}`, { headers }),
        ])

        if (expRes.ok) {
          const raw = await expRes.json()
          setExperiencias(raw.map(mapExperienceFromBackend))
        }

        if (compRes.ok) {
          const raw = await compRes.json()
          setCompetencias(raw.map(mapSkillFromBackend))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  async function addExperience() {
    const newExp: Experience = {
      id: "",
      company: "",
      position: "",
      years: 0,
    }

    const res = await fetch(`${apiUrl}/experiencias/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(mapExperienceToBackend(newExp, user!.id)),
    })

    const saved = mapExperienceFromBackend(await res.json())
    setExperiencias([...experiencias, saved])
  }

  function updateExperience(index: number, field: keyof Experience, value: string | number) {
    const updated = [...experiencias]
    updated[index] = { ...updated[index], [field]: value }
    setExperiencias(updated)
  }

  async function persistExperience(exp: Experience) {
    if (!exp.id) return

    await fetch(`${apiUrl}/experiencias/${exp.id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(mapExperienceToBackend(exp, user!.id)),
    })
  }

  async function deleteExperience(expId: number) {
    await fetch(`${apiUrl}/experiencias/${expId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    setExperiencias(experiencias.filter((e) => Number(e.id) !== expId))
  }

  const [newSkill, setNewSkill] = useState("")

  async function addCompetencia() {
    if (!newSkill.trim()) return

    const payload = mapSkillToBackend({ id: 0, name: newSkill })

    const res = await fetch(`${apiUrl}/competencias/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    const saved = mapSkillFromBackend(await res.json())
    setCompetencias([...competencias, saved])
    setNewSkill("")
  }

  async function removeCompetencia(id: number) {
    await fetch(`${apiUrl}/competencias/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    setCompetencias(competencias.filter((c) => c.id !== id))
  }

  async function saveAll() {
    setIsSaving(true)

    try {
      for (const exp of experiencias) {
        if (exp.id) await persistExperience(exp)
      }

      toast({
        title: "Informações salvas!",
        description: "Experiências e competências foram atualizadas.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <p>Carregando...</p>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil Profissional</CardTitle>
          <CardDescription>Gerencie sua experiência e competências</CardDescription>
        </CardHeader>
        <CardContent>
          
          {/* ---------------- SKILLS ---------------- */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">Competências</h3>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ex: React, Docker..."
              />
              <Button onClick={addCompetencia}>Adicionar</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {competencias.map((c) => (
                <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                  {c.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompetencia(c.id)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* ---------------- EXPERIENCES ---------------- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Experiências</h3>
              <Button variant="outline" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            {experiencias.map((exp, index) => (
              <Card key={exp.id ?? index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Experiência {index + 1}</h4>
                    {exp.id && (
                      <Button variant="ghost" size="sm" onClick={() => deleteExperience(Number(exp.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        onBlur={() => persistExperience(exp)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                        onBlur={() => persistExperience(exp)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Anos</Label>
                      <Input
                        type="number"
                        value={exp.years}
                        onChange={(e) => updateExperience(index, "years", Number(e.target.value))}
                        onBlur={() => persistExperience(exp)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-6">
            <Button onClick={saveAll} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar tudo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}