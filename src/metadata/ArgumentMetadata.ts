import 'reflect-metadata'
import { getTypeMetadata } from "../storage";

export class ArgumentMetadata {
  argumentType: Function

  constructor(typeClassPrototype: Function, fieldName: string) {
    const argumentTypes = Reflect.getMetadata('design:paramtypes', typeClassPrototype, fieldName)
    if (argumentTypes && argumentTypes[1]) {
      this.argumentType = argumentTypes[1]
    }
  }

  getLiteral = () => {
    if (!this.argumentType) return ''

    const argumentTypeFieldMap = getTypeMetadata(this.argumentType.prototype).fieldMetadataMap
    const argumentLiterals = Object.keys(argumentTypeFieldMap).map(argumentName => {
      return argumentTypeFieldMap[argumentName].getLiteral()
    })
    return argumentLiterals.length ? `(${argumentLiterals.join(', ')})` : ''
  }
}