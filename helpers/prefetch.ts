import { dehydrate, FetchQueryOptions, QueryClient } from "@tanstack/react-query"

export const preFetch = (prefetchQueryParams: (params: any) => FetchQueryOptions) => async (params: any) => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(prefetchQueryParams(params))

    return dehydrate(queryClient)
}
