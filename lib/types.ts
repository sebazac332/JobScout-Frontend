export interface User {
  id: string
  email: string
  name: string
  cpf: string
  role: "user" | "admin"
  token: string
  createdAt: string
  phone?: string
  workArea?: string
  educationLevel?: string
}

export interface Company {
  id: number
  name: string
  description: string
  city: string
  cep: string
  employees: number
  years: number
  admin_id: number
}

export interface Job {
  id: number
  title: string
  description: string
  salary: number
  type: "presencial" | "hibrido" | "remoto" | "estagio"
  positions: number
  companyId: number
  requirements: string[]
}

export interface Experience {
  id: string
  company: string
  position: string
  years: number
}

export interface Skill {
  id: number
  name: string
}

export interface Application {
  id: string
  userId: string
  jobId: string
  cvId: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedAt: string
  user?: User
  job?: Job
  cv?: CV
}
