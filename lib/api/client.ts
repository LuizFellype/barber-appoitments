import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from ".";
import { fetchApi } from "./shared";

export interface Service {
  id: string
  name: string
  description: string
  priceCents: number
  durationMin: number
}

export interface Slot {
  id: string
  /** ISO date (YYYY-MM-DD). */
  date: string
  /** HH:mm. */
  time: string
  barberId: string
  barberName: string
}

export interface DayAvailability {
  date: string
  slots: Slot[]
}

export const useActiveServices = () => {
  return useQuery({
    queryKey: ["ActiveServices"],
    queryFn: (): Promise<Service[]> =>
      API.Query.ActiveServices().then((data: { Service: Service[] }) => data.Service),
  })
}

export const useAvailability = () => {
  const today = new Date().toISOString().slice(0, 10)

  return useQuery({
    queryKey: ["Availability", today],
    queryFn: (): Promise<DayAvailability[]> =>
      API.Query.Availability({ today }).then(
        (data: { Slot: (Omit<Slot, "barberName"> & { Barber: { name: string } })[] }): DayAvailability[] => {
          const byDay = new Map<string, Slot[]>()
          for (const { Barber, ...slot } of data.Slot) {
            const withBarber = { ...slot, barberName: Barber.name }
            if (!byDay.has(slot.date)) byDay.set(slot.date, [])
            byDay.get(slot.date)!.push(withBarber)
          }
          return [...byDay.entries()].map(([date, slots]) => ({ date, slots }))
        },
      ),
  })
}

export interface CreateBookingInput {
  name: string
  contact: string
  slotId: string
  serviceIds: string[]
}

export interface CreateBookingResult {
  id: string
  /** 1-based position among the client's non-cancelled appointments (booking order). */
  visitNumber: number
  /** True every MILESTONE_INTERVAL-th visit (see lib/loyalty.ts) — surprise gift time. */
  isMilestone: boolean
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBookingInput): Promise<CreateBookingResult> => API.POST.CreateBooking(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Availability"] })
    },
  })
}

export interface MyAppointment {
  id: string
  date: string
  time: string
  barberName: string
  totalCents: number
  maintenanceFeeCents: number
  /** Set once the client has requested cancellation; null while still active. */
  cancellationRequestedAt: string | null
  services: { name: string; priceCents: number }[]
  /** 1-based position among the client's non-cancelled appointments (booking order). */
  visitNumber: number
  /** True every MILESTONE_INTERVAL-th visit (see lib/loyalty.ts) — surprise gift time. */
  isMilestone: boolean
}

/** Explicit search-on-submit rather than a query keyed by contact, since this
 * is a one-off lookup triggered by a form, not data that should stay cached
 * or refetch as the user types. */
export const useMyAppointments = () => {
  return useMutation({
    mutationFn: (contact: string): Promise<MyAppointment[]> => API.GET.MyAppointments({ contact }),
  })
}

/** Flags an appointment as "client wants to cancel" (soft cancellation): the
 * admin sees the request and contacts the client to confirm before actually
 * cancelling it from the admin panel. Not a real cancellation by itself. */
export const useRequestAppointmentCancellation = () => {
  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: string }): Promise<{ ok: boolean; cancellationRequestedAt: string }> =>
      fetchApi(`my-appointments/${id}/cancel-request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contact }),
      }),
  })
}
