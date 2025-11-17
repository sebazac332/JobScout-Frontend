"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Search, FileText } from 'lucide-react'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && user && mounted) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard")
    }
  }, [user, isLoading, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Redirecionando...
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">JobSearch</h1>
          </div>
          <Button onClick={() => router.push("/auth")}>Entrar</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Encontre sua próxima
            <span className="text-primary"> oportunidade</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Conectamos talentos com as melhores empresas. Cadastre seu CV e candidate-se às vagas que combinam com seu
            perfil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/auth")}>
              Começar agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/jobs")}>
              Ver vagas
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Busca Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Encontre vagas que combinam com suas habilidades e experiência
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>CV Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Crie e gerencie seu currículo de forma simples e profissional
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Empresas Verificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Conecte-se com empresas confiáveis e oportunidades reais
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Candidaturas Fáceis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">Candidate-se às vagas com apenas alguns cliques</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para começar?</CardTitle>
              <CardDescription>
                Junte-se a milhares de profissionais que já encontraram suas oportunidades ideais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => router.push("/auth")}>
                Criar conta gratuita
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
