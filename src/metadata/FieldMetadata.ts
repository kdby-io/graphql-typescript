import { ArgumentMetadata } from "./ArgumentMetadata";

export type FieldTypeFunc = (type?: any) => (Function|Function[])

export type FieldMetadataConstructorOptions = {
  isMutation: boolean
}

export class FieldMetadata {
  name: string
  isList: boolean
  typeFunc: FieldTypeFunc
  isMutation: boolean
  nullable: boolean
  resolver: Function
  argumentMetadata: ArgumentMetadata

  constructor(
    name: string,
    typeFunc: FieldTypeFunc,
    argumentMetadata: ArgumentMetadata,
    descriptor: PropertyDescriptor,
    options: FieldMetadataConstructorOptions = { isMutation: false }
  ) {
    if (typeof typeFunc !== 'function') {
      throw new Error(`A argument of @${options.isMutation ? 'Mutation' : 'Field'} must be a function`)
    }

    this.name = name
    this.isList = Array.isArray(typeFunc())
    this.typeFunc = typeFunc
    this.argumentMetadata = argumentMetadata,
    this.isMutation = options && options.isMutation || false
    this.nullable = false
    this.resolver = descriptor && descriptor.value
  }

  setNullable = () => {
    this.nullable = true
  }

  getLiteral = () => {
    const { isMutation, isList, typeFunc, nullable } = this
  
    const literal: string = `${
      isMutation ? '\n    extend type Mutation {\n\t' : ''
    }${
      this.name
    }${
      this.argumentMetadata.getLiteral()
    }: ${
      isList ? `[${(typeFunc() as Function[])[0].name}]` : (typeFunc() as Function).name
    }${
      nullable ? '' : '!'
    }${
      isMutation ? '\n    }' : ''
    }`
  
    return literal
  }
}