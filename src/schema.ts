import { makeExecutableSchema } from 'graphql-tools'
import { IExecutableSchemaDefinition } from 'graphql-tools/dist/Interfaces';
import { omit } from 'lodash'

import { chop } from './factory'
import { GraphQLSchema } from 'graphql';

type Options = TypeArrayOption & RestOptions
type TypeArrayOption = { models: Function[] }
type RestOptions = Pick<IExecutableSchemaDefinition, 'connectors'|'logger'|'allowUndefinedInResolve'|'resolverValidationOptions'|'directiveResolvers'>

export const makeSchema = (rootModel: Function, options: Options): GraphQLSchema => {
  const { types, mutations, resolvers } = chop([rootModel, ...options.models])
  const hasMutations = Object.keys(mutations).length !== 0

  const schema = `
    schema {
      query: ${rootModel.name}
      ${hasMutations ? 'mutation: Mutation' : ''}
    }
    ${hasMutations ? 'type Mutation' : ''}
  `

  const schemaDefinition: any = {
    typeDefs: [schema, ...types],
    resolvers: {
      [rootModel.name]: resolvers[rootModel.name],
      Mutation: mutations,
      ...omit(resolvers, rootModel.name),
    },
    ...omit(options, 'models'),
  }

  if (hasMutations) {
    delete schemaDefinition.resolvers.Mutation
  }

  return makeExecutableSchema(schemaDefinition)
}
