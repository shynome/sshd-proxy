import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const APIPath = '/api'

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: new HttpLink({
    uri: APIPath,
    fetch: fetch as any,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})
