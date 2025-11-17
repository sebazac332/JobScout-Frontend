"use client"
import { UserLayout } from "@/components/user/user-layout"
import { JobSearch } from "@/components/user/job-search"
import type { Job } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { mockApplications, mockCVs } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const handleApply = (job: Job) => {
    if (!user) return

    // Verificar se o usuário já se candidatou
    const existingApplication = mockApplications.find((app) => app.userId === user.id && app.jobId === job.id)

    if (existingApplication) {
      toast({
        title: "Candidatura já enviada",
        description: "Você já se candidatou a esta vaga.",
        variant: "destructive",
      })
      return
    }

    // Verificar se o usuário tem CV cadastrado
    const userCV = mockCVs.find((cv) => cv.userId === user.id)
    if (!userCV) {
      toast({
        title: "CV necessário",
        description: "Você precisa cadastrar seu CV antes de se candidatar às vagas.",
        variant: "destructive",
      })
      return
    }

    // Simular candidatura
    const newApplication = {
      id: Date.now().toString(),
      userId: user.id,
      jobId: job.id,
      cvId: userCV.id,
      status: "pending" as const,
      appliedAt: new Date().toISOString(),
    }

    mockApplications.push(newApplication)

    toast({
      title: "Candidatura enviada!",
      description: `Sua candidatura para ${job.title} foi enviada com sucesso.`,
    })
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Buscar Vagas</h1>
          <p className="text-muted-foreground">Encontre oportunidades que combinam com seu perfil</p>
        </div>

        <JobSearch onApply={handleApply} />
      </div>
    </UserLayout>
  )
}
