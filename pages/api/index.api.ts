import { PageConfig } from 'next'
export const config: PageConfig = { api: { bodyParser: false } }

import { ApolloServer } from 'apollo-server-micro'
import { AppModule } from './app.module'
import { dev as isDev } from '~libs/config'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export const schema = AppModule.schema
SchemaDirectiveVisitor.visitSchemaDirectives(schema, AppModule.schemaDirectives)

const apolloServer = new ApolloServer({
  schema: schema,
  context: AppModule.context,
  tracing: isDev,
  introspection: isDev,
  playground: isDev && {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
})

export default apolloServer.createHandler({
  path: '/api',
})
