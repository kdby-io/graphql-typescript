import { makeExecutableSchema } from 'graphql-tools'
import { IExecutableSchemaDefinition } from 'graphql-tools/dist/Interfaces';
import { omit } from 'lodash'

import { createSchemaDescriptor } from './factory'
import { GraphQLSchema } from 'graphql';

type Options = TypeArrayOption & RestOptions
type TypeArrayOption = { types: Function[] }
type RestOptions = Pick<IExecutableSchemaDefinition, 'connectors'|'logger'|'allowUndefinedInResolve'|'resolverValidationOptions'|'directiveResolvers'>

export const makeSchema = (rootType: Function, options: Options): GraphQLSchema => {
  const { literals, mutations, resolvers } = createSchemaDescriptor([rootType, ...options.types])
  const hasMutations = Object.keys(mutations).length !== 0

  const schema = `
    schema {
      query: ${rootType.name}
      ${hasMutations ? 'mutation: Mutation' : ''}
    }
    ${hasMutations ? 'type Mutation' : ''}
  `

  const schemaDefinition: any = {
    typeDefs: [schema, ...literals],
    resolvers: {
      [rootType.name]: resolvers[rootType.name],
      Mutation: mutations,
      ...omit(resolvers, rootType.name),
    },
    ...omit(options, 'types'),
  }

  if (!hasMutations) {
    delete schemaDefinition.resolvers.Mutation
  }

  return makeExecutableSchema(schemaDefinition)
}
