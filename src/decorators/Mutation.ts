import { getTypeMetadata } from '../services'
import { FieldMetadata, FieldTypeFunc } from '../metadata/FieldMetadata';

export function Mutation(typeFunc: FieldTypeFunc): Function {
  return (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => {

    const metadata = new FieldMetadata(propertyName, typeFunc, descriptor, { isMutation: true })
    getTypeMetadata(prototype).addFieldMetadata(propertyName, metadata)
  }
}
