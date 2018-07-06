import { getTypeMetadata } from '../services'
import { FieldMetadata, FieldTypeFunc } from '../metadata/FieldMetadata';


export function Field(typeFunc: FieldTypeFunc): Function {
  return (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => {

    const metadata = new FieldMetadata(propertyName, typeFunc, descriptor)
    getTypeMetadata(prototype).addFieldMetadata(propertyName, metadata)
  }
}
