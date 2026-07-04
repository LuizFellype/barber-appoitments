import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from ".";
import { toast } from "@/hooks/use-toast";

// Example of the react-query + lib/api pattern to copy for real features:
// a query hook backed by GraphQL, and a mutation hook that invalidates it on success.

const exampleKey = "Example"

export const useExample = () => {
  return useQuery({
    queryKey: [exampleKey],
    queryFn: () => API.Query.Example(),
  })
}

export const useCreateExample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Record<string, any>) => {
      // return API.Mutation.CreateExample({ input })
      return API.POST.Example(input as any)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [exampleKey] })
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: `${error}`,
      });
    }
  })
}
