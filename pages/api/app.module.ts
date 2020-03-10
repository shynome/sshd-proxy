import { PM2Module } from '~modules/pm2'
import { GraphQLModule } from '@graphql-modules/core'
import { apps_filepath } from '~libs/config'

export const AppModule = new GraphQLModule({
  imports: [
    PM2Module.forRoot({
      apps_filepath: apps_filepath,
    }),
  ],
})
