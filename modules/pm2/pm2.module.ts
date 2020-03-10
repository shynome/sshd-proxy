import { GraphQLModule, ModuleContext } from '@graphql-modules/core'
import { Resolvers } from '~modules/graphql/codegen'
import PM2TypeDefs from '~modules/graphql/pm2.graphql'
import { PM2Config, PM2Provider } from './pm2.provider'
import { getSSHHosts } from '~modules/utils/server'

const resolvers: Resolvers<ModuleContext> = {
  Query: {
    SSHHosts() {
      return getSSHHosts()
    },
    PM2List(root, args, { injector }) {
      return injector.get(PM2Provider).list(args.input.pm_id) as any
    },
  },
  Mutation: {
    PM2AddProxy(root, args, { injector }) {
      return injector.get(PM2Provider).add_proxy(args.rule) as any
    },
    PM2DelProxy(root, args, { injector }) {
      return injector.get(PM2Provider).del_proxy(args.rule) as any
    },
  },
}

export const PM2Module = new GraphQLModule<PM2Config>({
  typeDefs: [PM2TypeDefs],
  resolvers: resolvers,
  providers: [PM2Provider],
  configRequired: true,
})
