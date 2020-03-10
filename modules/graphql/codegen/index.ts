import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Command = {
   __typename?: 'Command',
  locked: Scalars['Boolean'],
  metadata: Scalars['String'],
  started_at: Scalars['String'],
  finished_at: Scalars['String'],
  error: Scalars['String'],
};

export type Monit = {
   __typename?: 'Monit',
  /** The number of bytes the process is using. */
  memory: Scalars['Int'],
  /** The percent of CPU being used by the process at the moment. */
  cpu: Scalars['Int'],
};

export type Mutation = {
   __typename?: 'Mutation',
  PM2AddProxy: Proc,
  PM2DelProxy: Proc,
};


export type MutationPm2AddProxyArgs = {
  rule: Scalars['String']
};


export type MutationPm2DelProxyArgs = {
  rule: Scalars['String']
};

/** The list of path variables in the process’s environment */
export type Pm2Env = {
   __typename?: 'Pm2Env',
  /** The working directory of the process. */
  pm_cwd: Scalars['String'],
  /** The stdout log file path. */
  pm_out_log_path: Scalars['String'],
  /** The stderr log file path. */
  pm_err_log_path: Scalars['String'],
  /** The interpreter used. */
  exec_interpreter: Scalars['String'],
  /** The uptime of the process. */
  pm_uptime: Scalars['Int'],
  /** The number of unstable restarts the process has been through. */
  unstable_restarts: Scalars['Int'],
  restart_time: Scalars['Int'],
  /** 'online' | 'stopping' | 'stopped' | 'launching' | 'errored' | 'one-launch-status' */
  status: Scalars['String'],
  /** The number of running instances. */
  instances: Scalars['Int'],
  /** The path of the script being run in this process. */
  pm_exec_path: Scalars['String'],
};

export type Pm2ListParams = {
  pm_id: Scalars['Int'],
};

export type Proc = {
   __typename?: 'Proc',
  name: Scalars['String'],
  vizion: Scalars['Boolean'],
  autorestart: Scalars['Boolean'],
  exec_mode: Scalars['String'],
  exec_interpreter: Scalars['String'],
  pm_exec_path: Scalars['String'],
  pm_cwd: Scalars['String'],
  instances: Scalars['Int'],
  node_args: Array<Maybe<Scalars['String']>>,
  pm_out_log_path: Scalars['String'],
  pm_err_log_path: Scalars['String'],
  pm_pid_path: Scalars['String'],
  status: Scalars['String'],
  pm_uptime: Scalars['Int'],
  vizion_running: Scalars['Boolean'],
  created_at: Scalars['Int'],
  pm_id: Scalars['Int'],
  restart_time: Scalars['Int'],
  unstable_restarts: Scalars['Int'],
  started_inside: Scalars['Boolean'],
  command: Command,
  exit_code: Scalars['Int'],
};

export type ProcessDescription = {
   __typename?: 'ProcessDescription',
  /** The name given in the original start command. */
  name: Scalars['String'],
  /** The pid of the process. */
  pid: Scalars['Int'],
  /** The pid for the pm2 God daemon process. */
  pm_id: Scalars['Int'],
  monit: Monit,
  pm2_env?: Maybe<Pm2Env>,
};

export type Query = {
   __typename?: 'Query',
  SSHHosts: Array<Maybe<Scalars['String']>>,
  PM2List: Array<Maybe<ProcessDescription>>,
};


export type QueryPm2ListArgs = {
  input?: Maybe<Pm2ListParams>
};




export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  String: ResolverTypeWrapper<Scalars['String']>,
  PM2ListParams: Pm2ListParams,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ProcessDescription: ResolverTypeWrapper<ProcessDescription>,
  Monit: ResolverTypeWrapper<Monit>,
  Pm2Env: ResolverTypeWrapper<Pm2Env>,
  Mutation: ResolverTypeWrapper<{}>,
  Proc: ResolverTypeWrapper<Proc>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Command: ResolverTypeWrapper<Command>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  String: Scalars['String'],
  PM2ListParams: Pm2ListParams,
  Int: Scalars['Int'],
  ProcessDescription: ProcessDescription,
  Monit: Monit,
  Pm2Env: Pm2Env,
  Mutation: {},
  Proc: Proc,
  Boolean: Scalars['Boolean'],
  Command: Command,
};

export type CommandResolvers<ContextType = any, ParentType extends ResolversParentTypes['Command'] = ResolversParentTypes['Command']> = {
  locked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  metadata?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  started_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  finished_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  error?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MonitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Monit'] = ResolversParentTypes['Monit']> = {
  memory?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  cpu?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  PM2AddProxy?: Resolver<ResolversTypes['Proc'], ParentType, ContextType, RequireFields<MutationPm2AddProxyArgs, 'rule'>>,
  PM2DelProxy?: Resolver<ResolversTypes['Proc'], ParentType, ContextType, RequireFields<MutationPm2DelProxyArgs, 'rule'>>,
};

export type Pm2EnvResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pm2Env'] = ResolversParentTypes['Pm2Env']> = {
  pm_cwd?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_out_log_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_err_log_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  exec_interpreter?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_uptime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  unstable_restarts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  restart_time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  instances?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  pm_exec_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProcResolvers<ContextType = any, ParentType extends ResolversParentTypes['Proc'] = ResolversParentTypes['Proc']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  vizion?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  autorestart?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  exec_mode?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  exec_interpreter?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_exec_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_cwd?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  instances?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  node_args?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>,
  pm_out_log_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_err_log_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_pid_path?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pm_uptime?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  vizion_running?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  created_at?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  pm_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  restart_time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  unstable_restarts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  started_inside?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  command?: Resolver<ResolversTypes['Command'], ParentType, ContextType>,
  exit_code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type ProcessDescriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProcessDescription'] = ResolversParentTypes['ProcessDescription']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  pid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  pm_id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  monit?: Resolver<ResolversTypes['Monit'], ParentType, ContextType>,
  pm2_env?: Resolver<Maybe<ResolversTypes['Pm2Env']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  SSHHosts?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>,
  PM2List?: Resolver<Array<Maybe<ResolversTypes['ProcessDescription']>>, ParentType, ContextType, QueryPm2ListArgs>,
};

export type Resolvers<ContextType = any> = {
  Command?: CommandResolvers<ContextType>,
  Monit?: MonitResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Pm2Env?: Pm2EnvResolvers<ContextType>,
  Proc?: ProcResolvers<ContextType>,
  ProcessDescription?: ProcessDescriptionResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
