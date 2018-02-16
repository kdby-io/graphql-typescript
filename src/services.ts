import 'reflect-metadata'
import { Property, PropertyDictionary } from '.'
import { map } from 'lodash'

export function createProperty(prototype: any, propertyName: string, descriptor?: PropertyDescriptor, options?: Partial<Property>) {
  const property: Partial<Property> = { nullable: false, isList: false, isMutation: false, ...options }

  if (!(options && options.type)) {
    const propertyType = Reflect.getMetadata('design:type', prototype, propertyName)

    switch (propertyType.name) {
      // with resolver
      case 'Function':
        const propertyReturnType = Reflect.getMetadata('design:returntype', prototype, propertyName)
        if (!propertyReturnType || propertyReturnType.name === 'Promise') {
          throw new Error(`Specify field type of '${propertyName}' in '${prototype.constructor.name}'. ex) @Field(String)`)
        }
        property.type = propertyReturnType
        break

      case 'Array':
      case 'Object':
        throw new Error(`Specify field type of '${propertyName}' in '${prototype.constructor.name}'. ex) @Field(String)`)

      default:
        property.type = propertyType
        break
    }
  }

  if (descriptor && descriptor.value) {
    property.resolver = descriptor.value
  }

  return property as Property
}


export function setLiteral(prototype: any, literal: string) {
  Reflect.defineMetadata('graphql:literal', literal, prototype)
}


export function getLiteral(prototype: any): string {
  return Reflect.getMetadata('graphql:literal', prototype)
}


export function addProperty(prototype: any, propertyName: string, property: Property) {
  const properties = getProperties(prototype)
  properties[propertyName] = property
  setProperties(prototype, properties)
}


function setProperties(prototype: any, properties: PropertyDictionary) {
  Reflect.defineMetadata('graphql:properties', properties, prototype)
}


export function getProperties(prototype: any): PropertyDictionary {
  return Reflect.getMetadata('graphql:properties', prototype) || {}
}


export function setPropertyOptions(prototype: any, propertyName: string, options: Partial<Property>) {
  const properties = getProperties(prototype)
  properties[propertyName] = {
    ...properties[propertyName],
    ...options,
  }
  setProperties(prototype, properties)
}


export function getPropertyLiteral(prototype: any, propertyName: string): string {
  const property = getProperties(prototype)[propertyName]
  return `${
    property.isMutation ? '\n    extend type Mutation {\n\t' : ''
  }${
        propertyName 
      }${
        getArgumentLiterals(prototype, propertyName)
      }: ${
        property.isList ? '[' : ''
      }${
        property.type.name
      }${
        property.isList ? ']' : ''
      }${
        property.nullable ? '' : '!'
  }${
    property.isMutation ? '\n    }' : ''
  }`
}


function getArgumentLiterals(prototype: any, resolverName: string) {
  const argumentType = getArgumentType(prototype, resolverName)
  if (!argumentType) return ''

  const argumentProperties = getProperties(argumentType.prototype)
  const argumentLiterals = map(argumentProperties, (_: Property, argumentName) => {
    return getPropertyLiteral(argumentType.prototype, argumentName)
  })
  return argumentLiterals.length ? `(${argumentLiterals.join(', ')})` : ''
}


function getArgumentType(prototype: any, resolverName: string) {
  const resolverArgumentTypes = Reflect.getMetadata('design:paramtypes', prototype, resolverName)
  if (!resolverArgumentTypes || !resolverArgumentTypes[1]) return

  const argumentType = resolverArgumentTypes[1]
  if (argumentType.name === 'Object') {
    throw new Error(`The second parameter type of ${resolverName} must be a class including Input type fields.`)
  }
  return argumentType
}
