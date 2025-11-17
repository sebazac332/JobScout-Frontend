export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  cpf: string
  phone?: string
  workArea?: string
  educationLevel?: string
  createdAt: string
}

export interface Company {
  id: string
  name: string
  description: string
  website?: string
  logo?: string
  createdAt: string
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  salary?: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  companyId: string
  company?: Company
  createdAt: string
  isActive: boolean
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
