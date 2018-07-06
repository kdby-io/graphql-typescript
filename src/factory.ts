import { reduce } from 'lodash'
import { getTypeMetadata, getFieldLiteral } from './services'

interface TypeStore {
  name: string
  literals: string[]
  resolvers: { [fieldName: string]: Function }
  mutations: { [mutationName: string]: Function }
}
export interface SchemaStore {
  literals: string[]
  resolvers: { [typeName: string]: { [fieldName: string]: Function } }
  mutations: { [mutationName: string]: Function }
}


const createTypeStore = (type: any) => {
  const typeMetadata = getTypeMetadata(type.prototype)
  const typeStore: TypeStore = {
    name: type.name,
    literals: [typeMetadata.getLiteral()],
    resolvers: {},
    mutations: {},
  }

  return reduce(typeMetadata.fieldMetadataMap, (store, fieldMetadata, fieldName) => {
    if (fieldMetadata.resolver)
      store[fieldMetadata.isMutation ? 'mutations' : 'resolvers'][fieldName] = fieldMetadata.resolver
    if (fieldMetadata.isMutation)
      store.literals.push(getFieldLiteral(type.prototype, fieldName))

    return store
  }, typeStore)
}


export const createSchemaStore = (types: Function[]) => {
  const schemaStore: SchemaStore = {
    literals: [],
    resolvers: {},
    mutations: {},
  }

  return reduce(types, (store, type) => {
    const typeStore = createTypeStore(type)
    schemaStore.literals.push(...typeStore.literals)
    schemaStore.resolvers[typeStore.name] = typeStore.resolvers
    schemaStore.mutations = { ...schemaStore.mutations, ...typeStore.mutations }

    return store
  }, schemaStore)
}
