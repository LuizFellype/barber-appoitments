import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { AdminAPI, type ServiceInput } from "./admin"

const servicesKey = "AdminServices"
const slotsKey = "AdminSlots"
const appointmentsKey = "AdminAppointments"

function onErrorToast(title: string) {
  return (error: unknown) => toast({ title, description: `${error}` })
}

export const useAdminServices = () =>
  useQuery({ queryKey: [servicesKey], queryFn: () => AdminAPI.listServices() })

export const useCreateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ServiceInput) => AdminAPI.createService(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [servicesKey] }),
    onError: onErrorToast("Erro ao criar servico"),
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ServiceInput }) => AdminAPI.updateService(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [servicesKey] }),
    onError: onErrorToast("Erro ao atualizar servico"),
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => AdminAPI.deleteService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [servicesKey] }),
    onError: onErrorToast("Erro ao excluir servico"),
  })
}

export const useAdminSlots = () =>
  useQuery({ queryKey: [slotsKey], queryFn: () => AdminAPI.listSlots() })

export const useAddSlots = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, times }: { date: string; times: string[] }) => AdminAPI.addSlots(date, times),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [slotsKey] }),
    onError: onErrorToast("Erro ao adicionar horarios"),
  })
}

export const useRemoveSlot = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => AdminAPI.removeSlot(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [slotsKey] }),
    onError: onErrorToast("Erro ao remover horario"),
  })
}

export const useAdminAppointmentsByDay = (date: string) =>
  useQuery({
    queryKey: [appointmentsKey, date],
    queryFn: () => AdminAPI.listAppointmentsByDay(date),
    enabled: !!date,
  })

export const useCancelAppointment = (date: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => AdminAPI.cancelAppointment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [appointmentsKey, date] }),
    onError: onErrorToast("Erro ao cancelar agendamento"),
  })
}
