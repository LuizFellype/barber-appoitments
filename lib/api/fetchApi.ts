import { fetchApi } from "./shared";

// REST fetch strategy: every entry maps to a route under app/api/<endpoint>.
// Add one enum member + endpoint mapping + variables type per new REST operation.
enum APIOperationNames {
  CreateBooking = "CreateBooking",
}

const EndpointByOperationName: Record<string, string> = {
  [APIOperationNames.CreateBooking]: "bookings",
}

interface VariablesTypePerAPIOperationName {
  [APIOperationNames.CreateBooking]: { name: string; contact: string; slotId: string; serviceIds: string[] }
}

const buildAPIGETRequest = <T>(endpoint: string, method = "GET") => async (variables: T) => {
  const url = (method === "GET" && !!variables)
    ? `${endpoint}?${new URLSearchParams(variables as Record<string, string> | string).toString()}`
    : endpoint

  const rest = method !== "GET" ? {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(variables),
  } : {}

  try {
    const data = await fetchApi(url, rest);

    return data
  } catch (error) {
    if (error) {
      console.error(">>> errors", error);
      throw new Error(error as string)
    }
  }
}

type APIBuilderType = Record<
  APIOperationNames,
  (variables: VariablesTypePerAPIOperationName[APIOperationNames]) => any
>

const createHTTPMethods = (method = "GET") => {
  return Object.values(APIOperationNames).reduce((acc, opName) => {
    type VariablesType = VariablesTypePerAPIOperationName[typeof opName]

    const fetchFunction = buildAPIGETRequest<VariablesType>(EndpointByOperationName[opName], method)

    return {
      ...acc,
      [opName]: fetchFunction
    };
  }, {} as APIBuilderType);
}

export const GET = createHTTPMethods("GET")
export const POST = createHTTPMethods("POST")
export const PATCH = createHTTPMethods("PATCH")
