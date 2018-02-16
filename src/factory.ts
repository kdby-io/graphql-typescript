import { reduce } from 'lodash'
import { getLiteral, getProperties, getPropertyLiteral } from './services'

interface TypeDescriptor {
  name: string
  literals: string[]
  resolvers: { [propertyName: string]: Function }
  mutations: { [mutationName: string]: Function }
}
export interface SchemaDescriptor {
  literals: string[]
  resolvers: { [modelName: string]: { [propertyName: string]: Function } }
  mutations: { [mutationName: string]: Function }
}


const createTypeDescriptor = (type: any) => {
  const properties = getProperties(type.prototype)
  const typeDescriptor: TypeDescriptor = {
    name: type.name,
    literals: [getLiteral(type.prototype)],
    resolvers: {},
    mutations: {},
  }

  return reduce(properties, (descriptor, property, propertyName) => {
    if (property.resolver)
      descriptor[property.isMutation ? 'mutations' : 'resolvers'][propertyName] = property.resolver
    if (property.isMutation)
      descriptor.literals.push(getPropertyLiteral(type.prototype, propertyName))

    return descriptor
  }, typeDescriptor)
}


export const createSchemaDescriptor = (types: Function[]) => {
  const schemaDescriptor: SchemaDescriptor = {
    literals: [],
    resolvers: {},
    mutations: {},
  }

  return reduce(types, (descriptor, type) => {
    const modelDescriptor = createTypeDescriptor(type)
    schemaDescriptor.literals.push(...modelDescriptor.literals)
    schemaDescriptor.resolvers[modelDescriptor.name] = modelDescriptor.resolvers
    schemaDescriptor.mutations = { ...schemaDescriptor.mutations, ...modelDescriptor.mutations }

    return descriptor
  }, schemaDescriptor)
}
