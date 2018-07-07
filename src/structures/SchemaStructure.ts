import { TypeStructure } from "../structures/TypeStructure";

export class SchemaStructure {
  literals: string[]
  resolvers: { [typeName: string]: { [fieldName: string]: Function } }
  mutations: { [mutationName: string]: Function }

  constructor(typeStructure: TypeStructure[]) {
    this.literals = []
    this.resolvers = {}
    this.mutations = {}

    typeStructure.forEach(typeDefinition => {
      this.literals.push(...typeDefinition.literals)
      this.resolvers[typeDefinition.name] = typeDefinition.resolvers
      this.mutations = Object.assign(this.mutations, typeDefinition.mutations)
    });
  }
}
