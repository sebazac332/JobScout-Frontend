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
}

export interface CV {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  updatedAt: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
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
