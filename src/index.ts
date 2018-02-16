export { Field, Input, Mutation, Nullable, Type } from './decorators'
export { String, Boolean, ID, Int, Float } from './types'
export { makeSchema } from './schema'

export interface Property {
  isList: boolean
  type: Function
  isMutation: boolean
  nullable?: boolean
  resolver?: Function
}
export type PropertyDictionary = { [propertyName: string]: Property }
export type ResolverDictionary = { [property: string]: Function }
