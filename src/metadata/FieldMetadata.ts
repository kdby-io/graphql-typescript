export type FieldTypeFunc = () => (Function|Function[])

type FieldMetadataConstructorOptions = {
  isMutation: boolean
}

export class FieldMetadata {
  name: string
  isList: boolean
  typeFunc: FieldTypeFunc
  isMutation: boolean
  nullable: boolean
  resolver: Function

  constructor(
    name: string,
    typeFunc: FieldTypeFunc,
    descriptor: PropertyDescriptor,
    options: FieldMetadataConstructorOptions = { isMutation: false }
  ) {
    this.name = name
    this.isList = Array.isArray(typeFunc())
    this.typeFunc = typeFunc
    this.isMutation = options && options.isMutation || false
    this.nullable = false
    this.resolver = descriptor && descriptor.value

    if (typeof typeFunc !== 'function') {
      throw new Error(`A argument of @${this.isMutation ? 'Mutation' : 'Field'} must be a function`)
    }
  }

  setNullable = () => {
    this.nullable = true
  }
}