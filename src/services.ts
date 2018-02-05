import 'reflect-metadata'
import { FieldDescriptor, FieldDescriptorDictionary } from '.'
import { map } from 'lodash'

export function setLiteral(prototype: any, literal: string) {
  Reflect.defineMetadata('graphql:literal', literal, prototype)
}

export function getLiteral(prototype: any): string {
  return Reflect.getMetadata('graphql:literal', prototype)
}

export function addField(prototype: any, fieldName: string, field: FieldDescriptor) {
  const fields = getFields(prototype)
  fields[fieldName] = field
  setFields(prototype, fields)
}

function setFields(prototype: any, fields: { [fieldName: string]: FieldDescriptor }) {
  Reflect.defineMetadata('graphql:fields', fields, prototype)
}

export function getFields(prototype: any): FieldDescriptorDictionary {
  return Reflect.getMetadata('graphql:fields', prototype) || {}
}

export function setFieldOptions(
  prototype: any,
  fieldName: string,
  options: Partial<FieldDescriptor>
) {
  const fields = getFields(prototype)
  fields[fieldName] = {
    ...fields[fieldName],
    ...options,
  }
  setFields(prototype, fields)
}

function setMutations(prototype: any, mutations: FieldDescriptorDictionary) {
  Reflect.defineMetadata('graphql:mutations', mutations, prototype)
}

export function getMutations(prototype: any): FieldDescriptorDictionary {
  return Reflect.getMetadata('graphql:mutations', prototype) || {}
}

export function addMutation(prototype: any, mutationName: string, mutation: FieldDescriptor) {
  const mutations = getMutations(prototype)
  mutations[mutationName] = mutation
  setMutations(prototype, mutations)
}

export function getFieldLiteral(prototype: any, fieldName: string): string {
  const field = getFields(prototype)[fieldName]
  console.log(field.type)
  return `${fieldName}${getArgumentLiterals(prototype, fieldName)}: ${field.isList ? '[' : ''}${
    field.type.name
  }${field.isList ? ']' : ''}${field.nullable ? '' : '!'}`
}

export function getMutationLiteral(prototype: any, mutationName: string) {
  const mutation = getMutations(prototype)[mutationName]
  return `
    extend type Mutation {
      \t${mutationName}${getArgumentLiterals(prototype, mutationName)}: ${
    mutation.isList ? '[' : ''
  }${mutation.type.name}${mutation.isList ? ']' : ''}${mutation.nullable ? '' : '!'}
    }
  `
}

function getArgumentLiterals(prototype: any, resolverName: string) {
  const argumentType = getArgumentType(prototype, resolverName)
  if (!argumentType) return ''
  const argumentFields = getFields(argumentType.prototype)
  const argumentLiterals = map(argumentFields, (_: FieldDescriptor, argumentName) => {
    return getFieldLiteral(argumentType.prototype, argumentName)
  })
  return `(${argumentLiterals.join(', ')})`
}

function getArgumentType(prototype: any, resolverName: string) {
  const resolverArgumentTypes = Reflect.getMetadata('design:paramtypes', prototype, resolverName)
  if (!resolverArgumentTypes || !resolverArgumentTypes[1]) return

  const argumentType = resolverArgumentTypes[1]
  if (argumentType.name === 'Object') {
    throw new Error(`${resolverName}의 인자 타입은 '@Input'으로 선언된 클래스 타입이여야 합니다.`)
  }
  return argumentType
}
