"use client"
import { JobSearch } from "@/components/user/job-search"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Job } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function PublicJobsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleApply = (job: Job) => {
    toast({
      title: "Login necessário",
      description: "Você precisa fazer login para se candidatar às vagas.",
    })
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">JobScout</h1>
          </div>
          <Button onClick={() => router.push("/auth")}>Entrar</Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Vagas Disponíveis</h1>
            <p className="text-muted-foreground">
              Explore as oportunidades disponíveis. Faça login para se candidatar.
            </p>
          </div>

          <JobSearch onApply={handleApply} />
        </div>
      </main>
    </div>
  )
}
