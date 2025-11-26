"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2 } from "lucide-react"
import { getStoredUser } from "@/lib/auth"

export default function AdminApplicationsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    const user = getStoredUser()
    const token = user?.token
    if (!token) throw new Error("No token available")

    try {
      const res = await fetch("http://localhost:8000/vagas/admin-with-applications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()
      console.log("DATA RECEIVED:", json)
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalApplications = data.reduce((acc, vaga) => acc + vaga.users.length, 0)

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Candidaturas</h1>
          <p className="text-muted-foreground">
            Visualize as candidaturas dos usuários às vagas
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
          <Card>
            <CardHeader>
              <CardTitle>Total de Vagas</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {data.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total de Candidaturas</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {totalApplications}
            </CardContent>
          </Card>
        </div>

        {/* APPLICATIONS LIST */}
        {data.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Users className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Nenhuma candidatura encontrada</h3>
              <p className="text-muted-foreground">Ainda não há usuários inscritos em vagas.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {data.map(vaga => (
              <Card key={vaga.id} className="border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {vaga.titulo}
                        <Badge variant="outline">{vaga.users.length} candidatos</Badge>
                      </CardTitle>

                      <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                        <Building2 className="h-4 w-4" />
                        Empresa ID: {vaga.empresa_id}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {vaga.users.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum candidato para esta vaga.</p>
                  ) : (
                    <div className="space-y-4">
                      {vaga.users.map(user => (
                        <div
                          key={user.id}
                          className="border rounded p-3 flex items-center justify-between bg-muted/30"
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>

                          <Badge variant="outline">Aplicou</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
