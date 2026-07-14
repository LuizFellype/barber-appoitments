import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from ".";

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
      API.Query.Availability({ today }).then((data: { Slot: Slot[] }): DayAvailability[] => {
        const byDay = new Map<string, Slot[]>()
        for (const slot of data.Slot) {
          if (!byDay.has(slot.date)) byDay.set(slot.date, [])
          byDay.get(slot.date)!.push(slot)
        }
        return [...byDay.entries()].map(([date, slots]) => ({ date, slots }))
      }),
  })
}

export interface CreateBookingInput {
  name: string
  contact: string
  slotId: string
  serviceIds: string[]
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBookingInput) => API.POST.CreateBooking(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Availability"] })
    },
  })
}

export interface MyAppointment {
  id: string
  date: string
  time: string
  totalCents: number
  maintenanceFeeCents: number
  services: { name: string; priceCents: number }[]
}

/** Explicit search-on-submit rather than a query keyed by contact, since this
 * is a one-off lookup triggered by a form, not data that should stay cached
 * or refetch as the user types. */
export const useMyAppointments = () => {
  return useMutation({
    mutationFn: (contact: string): Promise<MyAppointment[]> => API.GET.MyAppointments({ contact }),
  })
}
