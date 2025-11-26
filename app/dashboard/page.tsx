"use client"

import { UserLayout } from "@/components/user/user-layout"
import { JobSearch } from "@/components/user/job-search"
import type { Job } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const handleApply = async (job: Job) => {
    if (!user) return

    try {
      const res = await fetch(`http://localhost:8000/vagas/${job.id}/apply/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Erro ao aplicar")
      }

      toast({
        title: "Candidatura enviada!",
        description: `Você se candidatou para ${job.title}`,
      })
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  if (!user) return <p>Carregando...</p>

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Buscar Vagas</h1>
          <p className="text-muted-foreground">Encontre oportunidades que combinam com seu perfil</p>
        </div>

        <JobSearch userId={user.id} onApply={handleApply} />
      </div>
    </UserLayout>
  )
}
