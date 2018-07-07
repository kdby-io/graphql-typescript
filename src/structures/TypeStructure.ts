import { getTypeMetadata } from "../storage";

export class TypeStructure {
  name: string
  literals: string[]
  resolvers: { [fieldName: string]: Function }
  mutations: { [mutationName: string]: Function }

  constructor(type: any) {
    const typeMetadata = getTypeMetadata(type.prototype)

    this.name = type.name
    this.literals = [typeMetadata.getLiteral()]
    this.resolvers = {}
    this.mutations = {}

    Object.values(typeMetadata.fieldMetadataMap).forEach(fieldMetadata => {
      if (fieldMetadata.isMutation) {
        this.mutations[fieldMetadata.name] = fieldMetadata.resolver
        this.literals.push(fieldMetadata.getLiteral())

      } else if (fieldMetadata.resolver) {
        this.resolvers[fieldMetadata.name] = fieldMetadata.resolver
      }
    })
  }
}
