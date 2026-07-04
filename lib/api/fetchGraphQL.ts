async function fetchGraphQL(operationsDoc: string, operationName: string, variables = {}) {
  const fullUrl = `${process.env.__NEXT_PRIVATE_ORIGIN ?? ''}/api/graphql`

  const data = await fetch(
    fullUrl,
    {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await data.json()
}

const buildGQLRequest = <T>(operationsDoc: string, operationName: string, transformVariables = (variables: any) => variables) => async (variables: T) => {
  const { errors, data } = await fetchGraphQL(operationsDoc, operationName, transformVariables(variables));

  if (errors) {
    const uniqueKey = errors[0]?.message.includes("Uniqueness violation. duplicate key value violates unique constraint")
    const errorMessage = uniqueKey ? 'A unique field already exists in the database' : errors[0].message

    throw new Error(errorMessage)
  }

  return data
}

// Pagination helper shared by list-style GraphQL queries (Hasura limit/offset).
export const paginationParameters = {
  receiving: `$page: Int, $take: Int`,
  passing: `limit: $take, offset: $page`,
}

// GraphQL fetch strategy: hits /api/graphql, which proxies to Hasura (see app/api/graphql/route.tsx).
// Add one enum member + query/mutation doc + variables type per new operation.
export enum OperationNames {
  ActiveServices = 'ActiveServices',
  Availability = 'Availability',
}

interface VariablesTypePerOperationName {
  [OperationNames.ActiveServices]: void;
  [OperationNames.Availability]: { today: string };
}

const GQLRequestByOperationName = {
  [OperationNames.ActiveServices]: `query ${OperationNames.ActiveServices} {
    Service(where: { active: { _eq: true } }, order_by: { name: asc }) {
      id
      name
      description
      priceCents
      durationMin
    }
  }`,

  // A slot is free when it has no appointment with status SCHEDULED against it
  // (mirrors isSlotFree() in app-de-agendamento-de-barbearia/services/slots.ts).
  [OperationNames.Availability]: `query ${OperationNames.Availability}($today: date!) {
    Slot(
      where: { date: { _gte: $today }, _not: { Appointments: { status: { _eq: SCHEDULED } } } }
      order_by: [{ date: asc }, { time: asc }]
    ) {
      id
      date
      time
    }
  }`,
}

type QueryBuilderType = Record<
  OperationNames,
  (variables: VariablesTypePerOperationName[OperationNames]) => any
>

const defaultQueryVariableTransformer = (variables: any) => {
  if (!variables) return variables
  const { page, ...rest } = variables
  if (page) {
    return { page: page - 1, ...rest }
  }
  return rest
}

export const Query = Object.values(OperationNames).reduce((acc, opName) => {
  type VariablesType = VariablesTypePerOperationName[typeof opName]

  const fetchFunction = buildGQLRequest<VariablesType>(GQLRequestByOperationName[opName as OperationNames], opName, defaultQueryVariableTransformer)

  return {
    ...acc,
    [opName]: fetchFunction
  };
}, {} as QueryBuilderType);

// Add mutations the same way, e.g.:
// const createExample = `mutation CreateExample($input: example_insert_input!) { insert_example_one(object: $input) { id } }`
// export const Mutation = {
//   CreateExample: buildGQLRequest<{ input: any }>(createExample, 'CreateExample'),
// }
export const Mutation = {}
