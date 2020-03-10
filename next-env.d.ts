/// <reference types="next" />
/// <reference types="next/types/global" />
declare module '*.graphql' {
  import { DocumentNode } from 'graphql'
  const content: DocumentNode
  export default content
}
