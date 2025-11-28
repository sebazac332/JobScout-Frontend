"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  const [newSkill, setNewSkill] = useState("")
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
          fetch(`${apiUrl}/users/${user.id}/competencias`, { headers }),
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
        console.error("Erro ao carregar dados do CV:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  // ----- Experiences -----
  async function addExperience() {
    const newExp: Experience = {
      id: "",
      company: "",
      position: "",
      years: 0,
    }

    setExperiencias([...experiencias, newExp])
  }

  function updateExperience(index: number, field: keyof Experience, value: string | number) {
    const updated = [...experiencias]
    updated[index] = { ...updated[index], [field]: value }
    setExperiencias(updated)
  }

  async function persistExperience(exp: Experience, index: number) {
    if (!exp.id) {
      const res = await fetch(`${apiUrl}/experiencias/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(mapExperienceToBackend(exp, user!.id)),
      })

      const saved = mapExperienceFromBackend(await res.json())

      const updated = [...experiencias]
      updated[index] = saved
      setExperiencias(updated)
      return
    }

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

  async function addCompetencia() {
    if (!newSkill.trim()) return

    const payload = mapSkillToBackend({ id: 0, name: newSkill })
    const createRes = await fetch(`${apiUrl}/competencias/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    const created = mapSkillFromBackend(await createRes.json())

    await fetch(`${apiUrl}/users/${user!.id}/competencias/${created.id}`, {
      method: "POST",
      headers: getAuthHeaders(),
    })

    setCompetencias([...competencias, created])
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
    if (!user) return
    setIsSaving(true)

    try {
      const updatedExperiences: Experience[] = []

      for (let i = 0; i < experiencias.length; i++) {
        const exp = experiencias[i]

        if (!exp.company && !exp.position && !exp.years) {
          continue
        }

        let savedExp: Experience

        if (!exp.id) {
          const res = await fetch(`${apiUrl}/experiencias/`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(mapExperienceToBackend(exp, user.id)),
          })
          const data = await res.json()
          savedExp = mapExperienceFromBackend(data)
        } else {
          const res = await fetch(`${apiUrl}/experiencias/${exp.id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(mapExperienceToBackend(exp, user.id)),
          })
          const data = await res.json()
          savedExp = mapExperienceFromBackend(data)
        }

        updatedExperiences.push(savedExp)
      }

      setExperiencias(updatedExperiences)

      toast({
        title: "Informações salvas!",
        description: "Experiências e competências foram atualizadas.",
      })
    } catch (err: any) {
      console.error("Erro ao salvar experiências:", err)
      toast({
        title: "Erro",
        description: err.message || "Não foi possível salvar as experiências",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div className="space-y-6">
      {/* Competências */}
      <Card>
        <CardHeader>
          <CardTitle>Competências</CardTitle>
          <CardDescription>Adicione, visualize ou remova competências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Ex: React, Docker..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button onClick={addCompetencia}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {competencias.map((c) => (
              <Badge key={c.id} variant="secondary" className="flex items-center gap-1">
                {c.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompetencia(c.id)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experiências */}
      <Card>
        <CardHeader>
          <CardTitle>Experiências Profissionais</CardTitle>
          <CardDescription>Adicione, visualize ou remova experiências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Experiência
            </Button>
          </div>
          <div className="space-y-4">
            {experiencias.map((exp, index) => (
              <Card key={exp.id || index}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experiência {index + 1}</h4>
                      {exp.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteExperience(Number(exp.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          setExperiencias((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, company: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          setExperiencias((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, position: e.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Anos</Label>
                      <Input
                        type="number"
                        value={exp.years}
                        onChange={(e) =>
                          setExperiencias((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, years: Number(e.target.value) } : item
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pt-4">
            <Button onClick={saveAll} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar tudo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )}