import 'reflect-metadata'
import { map } from 'lodash'
import { TypeMetadata } from './metadata/TypeMetadata';

export function getTypeMetadata(prototype: any): TypeMetadata {
  const typeMetadata = Reflect.getMetadata('graphql:metadata', prototype) || new TypeMetadata(prototype)
  Reflect.defineMetadata('graphql:metadata', typeMetadata, prototype)

  return typeMetadata
}


export function getFieldLiteral(prototype: any, propertyName: string): string {
  const {
    isMutation,
    isList,
    typeFunc,
    nullable
  } = getTypeMetadata(prototype).fieldMetadataMap[propertyName]
  return `${
    isMutation ? '\n    extend type Mutation {\n\t' : ''
  }${
    propertyName 
  }${
    getArgumentLiterals(prototype, propertyName)
  }: ${
    isList ? `[${(typeFunc() as Function[])[0].name}]` : (typeFunc() as Function).name
  }${
    nullable ? '' : '!'
  }${
    isMutation ? '\n    }' : ''
  }`
}


function getArgumentLiterals(prototype: any, resolverName: string) {
  const argumentType = getArgumentType(prototype, resolverName)
  if (!argumentType) return ''

  const argumentProperties = getTypeMetadata(argumentType.prototype).fieldMetadataMap
  const argumentLiterals = map(argumentProperties, (_: any, argumentName) => {
    return getFieldLiteral(argumentType.prototype, argumentName)
  })
  return argumentLiterals.length ? `(${argumentLiterals.join(', ')})` : ''
}


function getArgumentType(prototype: any, resolverName: string): Function|undefined {
  const resolverArgumentTypes = Reflect.getMetadata('design:paramtypes', prototype, resolverName)
  if (!resolverArgumentTypes || !resolverArgumentTypes[1]) return

  const argumentType = resolverArgumentTypes[1]
  if (argumentType.name === 'Object') {
    throw new Error(`The second parameter type of ${resolverName} must be a class including Input type fields.`)
  }
  return argumentType
}
