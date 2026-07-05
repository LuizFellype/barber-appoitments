

export async function fetchApi(endpoint: string, rest = {}) {
  const fullUrl = `${process.env.__NEXT_PRIVATE_ORIGIN ?? ''}/api/${endpoint}`

  const result = await fetch(
    fullUrl,
    rest
  );

  const body = result.status === 204 ? null : await result.json();

  if (!result.ok) {
    throw new Error(body?.error || result.statusText)
  }

  return body;
}

export interface CommumVariablesType {
  pagination: {
    page?: number;
    take?: number;
  }
}
