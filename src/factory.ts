import { reduce } from 'lodash'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import { getLiteral, getFields, getMutations, getMutationLiteral } from './services'
import { FieldDescriptor } from '.'

interface Chopped {
  types: string[]
  resolvers: { [model: string]: { [property: string]: IResolvers } }
  mutations: { [model: string]: IResolvers }
}

// TODO: Rename
// TODO: Refactor
export const chop = (models: any[]) => {
  const result: Chopped = models.reduce((result: Chopped, model) => {
    const fields = getFields(model.prototype)
    const resolvers = reduce(fields, (resolvers: any, field: FieldDescriptor, fieldName) => {
      if (field.resolver) {
        resolvers[fieldName] = field.resolver
      }
      return resolvers
    }, {})
    result.resolvers[model.name] = resolvers

    const literals = getLiteral(model.prototype)
    if (literals) result.types.push(literals)

    const mutations = getMutations(model.prototype)
    const mutationResolvers = reduce(mutations, (mutationResolvers: any, field: FieldDescriptor, mutationName) => {
      mutationResolvers[mutationName] = field.resolver
      return mutationResolvers
    }, {})
    result.mutations = { ...result.mutations, ...mutationResolvers }

    const mutationLiterals = reduce(mutations, (literals: string[], _: FieldDescriptor, mutationName) => {
      const literal = getMutationLiteral(model.prototype, mutationName)
      literals.push(literal)
      return literals
    }, [])
    result.types = [...result.types, ...mutationLiterals]

    return result
  },
  { types: [], resolvers: {}, mutations: {} })

  return result
}
