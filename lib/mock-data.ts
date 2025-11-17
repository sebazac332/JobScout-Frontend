import type { User, Company, Job, CV, Application } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@jobsearch.com",
    name: "Admin User",
    role: "admin",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "joao@email.com",
    name: "João Silva",
    role: "user",
    cpf: "987.654.321-00",
    workArea: "Tecnologia",
    educationLevel: "superior",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    email: "maria@email.com",
    name: "Maria Santos",
    role: "user",
    cpf: "456.789.123-00",
    workArea: "Design",
    educationLevel: "pos",
    createdAt: "2024-01-03T00:00:00Z",
  },
]

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "TechCorp",
    description: "Empresa líder em tecnologia e inovação",
    website: "https://techcorp.com",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "StartupXYZ",
    description: "Startup focada em soluções digitais",
    website: "https://startupxyz.com",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "GlobalSoft",
    description: "Consultoria em software empresarial",
    website: "https://globalsoft.com",
    createdAt: "2024-01-03T00:00:00Z",
  },
]

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Desenvolvedor Frontend React",
    description:
      "Buscamos um desenvolvedor frontend experiente em React para integrar nossa equipe de desenvolvimento.",
    requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    salary: "R$ 8.000 - R$ 12.000",
    location: "São Paulo, SP",
    type: "full-time",
    companyId: "1",
    createdAt: "2024-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    title: "Designer UX/UI",
    description: "Procuramos um designer criativo para criar experiências incríveis para nossos usuários.",
    requirements: ["Figma", "Adobe Creative Suite", "Prototipagem", "Design System"],
    salary: "R$ 6.000 - R$ 10.000",
    location: "Remote",
    type: "remote",
    companyId: "2",
    createdAt: "2024-01-11T00:00:00Z",
    isActive: true,
  },
  {
    id: "3",
    title: "Desenvolvedor Backend Node.js",
    description: "Desenvolvedor backend para trabalhar com APIs e microserviços.",
    requirements: ["Node.js", "Express", "MongoDB", "Docker"],
    salary: "R$ 9.000 - R$ 14.000",
    location: "Rio de Janeiro, RJ",
    type: "full-time",
    companyId: "3",
    createdAt: "2024-01-12T00:00:00Z",
    isActive: true,
  },
]

export const mockCVs: CV[] = [
  {
    id: "1",
    userId: "2",
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    summary: "Desenvolvedor frontend com 3 anos de experiência em React e TypeScript.",
    experience: [
      {
        id: "1",
        company: "WebDev Inc",
        position: "Desenvolvedor Frontend",
        startDate: "2022-01-01",
        endDate: "2024-01-01",
        description: "Desenvolvimento de aplicações web com React e TypeScript.",
      },
    ],
    education: [
      {
        id: "1",
        institution: "Universidade de São Paulo",
        degree: "Bacharelado",
        field: "Ciência da Computação",
        startDate: "2018-01-01",
        endDate: "2021-12-01",
      },
    ],
    skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

export const mockApplications: Application[] = [
  {
    id: "1",
    userId: "2",
    jobId: "1",
    cvId: "1",
    status: "pending",
    appliedAt: "2024-01-15T00:00:00Z",
  },
]
