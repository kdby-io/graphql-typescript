import { makeExecutableSchema } from 'graphql-tools'
import { IExecutableSchemaDefinition } from 'graphql-tools/dist/Interfaces';
import { omit } from 'lodash'

import { chop } from './factory'

type Options = TypeArrayOption & RestOptions
type TypeArrayOption = { models: Function[] }
type RestOptions = Pick<IExecutableSchemaDefinition, 'connectors'|'logger'|'allowUndefinedInResolve'|'resolverValidationOptions'|'directiveResolvers'>

export const makeSchema = (rootModel: Function, options: Options) => {
  const schema = `
    schema {
      query: ${rootModel.name}
      mutation: Mutation
    }
    type Mutation
  `
    const { types, mutations, resolvers } = chop([rootModel, ...options.models])
    console.log(resolvers)

  return makeExecutableSchema({
    typeDefs: [schema, ...types],
    resolvers: {
      [rootModel.name]: resolvers[rootModel.name],
      Mutation: mutations,
      ...omit(resolvers, rootModel.name),
    },
    ...omit(options, 'models'),
  })
}
