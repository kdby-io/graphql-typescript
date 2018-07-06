import { forEach } from "lodash";
import { getFieldLiteral } from "../services";
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
    forEach(this.fieldMetadataMap, (fieldMetadata, fieldName) => {
      if (fieldMetadata.isMutation) return
      fieldLiterals.push(getFieldLiteral(this.classPrototype, fieldName))
    })
    const literal = `
      ${this.isInput ? 'input' : 'type'} ${this.classPrototype.constructor.name} {
      \t${fieldLiterals.join('\n\t')}
      }`
    console.log(literal)
    return literal
  }
}