import { FieldMetadata } from "./FieldMetadata";

export type FieldMetadataMap = { [fieldName: string]: FieldMetadata }

export class TypeMetadata {
  classPrototype: any
  isInput: boolean
  fieldMetadataMap: FieldMetadataMap

  constructor(classPrototype: any) {
    this.classPrototype = classPrototype
    this.isInput = false
    this.fieldMetadataMap = {}
  }

  setIsInput = () => {
    this.isInput = true
  }

  addFieldMetadata = (fieldName: string, fieldMetadata: FieldMetadata) => {
    this.fieldMetadataMap[fieldName] = fieldMetadata
  }

  getLiteral = () => {
    const fieldLiterals: string[] = []
    Object.values(this.fieldMetadataMap).forEach(fieldMetadata => {
      if (fieldMetadata.isMutation) return
      fieldLiterals.push(fieldMetadata.getLiteral())
    })

    const literal = `
      ${this.isInput ? 'input' : 'type'} ${this.classPrototype.constructor.name} {
      \t${fieldLiterals.join('\n\t')}
      }`
    
    return literal
  }
}