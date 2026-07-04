

export async function fetchApi(endpoint: string, rest = {}) {
  const fullUrl = `${process.env.__NEXT_PRIVATE_ORIGIN ?? ''}/api/${endpoint}`

  const result = await fetch(
    fullUrl,
    rest
  );

  return await result.json();
}

export interface CommumVariablesType {
  pagination: {
    page?: number;
    take?: number;
  }
}
