import * as APIMethods from "./fetchApi"
import { Query, Mutation } from "./fetchGraphQL"

const API = {
  Query, // Grapqhl
  Mutation, // Grapqhl
  ...APIMethods
}

export default API
