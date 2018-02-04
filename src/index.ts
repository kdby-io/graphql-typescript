export { Field, Input, Mutation, Nullable, Type } from './decorators'
export { String, Boolean, ID, Int, Float } from './types'
export { makeSchema } from './schema'

export interface FieldDescriptor {
  isList: boolean
  type: string
  nullable?: boolean
  resolver?: Function
}
export type FieldDescriptorDictionary = { [fieldName: string]: FieldDescriptor }
export type ResolverDictionary = { [property: string]: Function }