import { makeExecutableSchema } from 'graphql-tools'
import { IExecutableSchemaDefinition } from 'graphql-tools/dist/Interfaces';

import { TypeStructure } from './structures/TypeStructure';
import { SchemaStructure } from './structures/SchemaStructure';

type Options = TypeArrayOption & RestOptions
type TypeArrayOption = { types: Function[] }
type RestOptions = Pick<IExecutableSchemaDefinition, 'connectors'|'logger'|'allowUndefinedInResolve'|'resolverValidationOptions'|'directiveResolvers'>

export const makeSchema = (rootType: Function, { types }: Options) => {
  const typeDefinitions = [rootType, ...types].map(type => new TypeStructure(type))
  const { literals, mutations, resolvers } = new SchemaStructure(typeDefinitions)
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
      Mutation: mutations,
      ...resolvers
    },
  }

  if (!hasMutations) {
    delete schemaDefinition.resolvers.Mutation
  }

  return makeExecutableSchema(schemaDefinition)
}
