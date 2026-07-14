import { fetchApi } from "./shared"

export interface AdminService {
  id: string
  name: string
  description: string
  priceCents: number
  durationMin: number
  active: boolean
  createdAt: string
}

export interface ServiceInput {
  name: string
  description: string
  priceCents: number
  durationMin: number
  active: boolean
}

export interface AdminSlot {
  id: string
  date: string
  time: string
  booked: boolean
}

export interface AdminAppointment {
  id: string
  status: "SCHEDULED" | "CANCELLED"
  totalCents: number
  maintenanceFeeCents: number
  createdAt: string
  date: string
  time: string
  clientName: string
  clientContact: string
  services: { serviceId: string | null; name: string; priceCents: number }[]
}

export interface AdminClientStat {
  clientId: string
  name: string
  contact: string
  bookingsCount: number
  totalSpentCents: number
  /** Slot date/time of their most recent scheduled appointment (not when they booked it). */
  lastBookingDate: string | null
  lastBookingTime: string | null
}

const withJson = (method: string, body?: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
})

export const AdminAPI = {
  login: (key: string): Promise<{ ok: boolean }> => fetchApi("admin/login", withJson("POST", { key })),
  logout: (): Promise<{ ok: boolean }> => fetchApi("admin/logout", withJson("POST")),

  listServices: (): Promise<AdminService[]> => fetchApi("admin/services"),
  createService: (input: ServiceInput): Promise<AdminService> => fetchApi("admin/services", withJson("POST", input)),
  updateService: (id: string, input: ServiceInput): Promise<AdminService> =>
    fetchApi(`admin/services/${id}`, withJson("PATCH", input)),
  deleteService: (id: string): Promise<{ ok: boolean }> => fetchApi(`admin/services/${id}`, withJson("DELETE")),

  listSlots: (): Promise<AdminSlot[]> => fetchApi("admin/slots"),
  addSlots: (date: string, times: string[]): Promise<AdminSlot[]> =>
    fetchApi("admin/slots", withJson("POST", { date, times })),
  removeSlot: (id: string): Promise<{ ok: boolean }> => fetchApi(`admin/slots/${id}`, withJson("DELETE")),

  listAppointmentsByDay: (date: string): Promise<AdminAppointment[]> =>
    fetchApi(`admin/appointments?date=${encodeURIComponent(date)}`),
  cancelAppointment: (id: string): Promise<{ ok: boolean }> =>
    fetchApi(`admin/appointments/${id}/cancel`, withJson("POST")),

  listClientStats: (): Promise<AdminClientStat[]> => fetchApi("admin/stats"),
}
