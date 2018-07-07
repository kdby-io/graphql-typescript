import { FieldMetadata, FieldTypeFunc } from '../metadata/FieldMetadata';
import { getTypeMetadata } from '../storage';
import { ArgumentMetadata } from '../metadata/ArgumentMetadata';


export function Field(typeFunc: FieldTypeFunc): Function {
  return (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => {

    const argumentMetadata = new ArgumentMetadata(prototype, propertyName)
    const fieldMetadata = new FieldMetadata(propertyName, typeFunc, argumentMetadata, descriptor)
    getTypeMetadata(prototype).addFieldMetadata(propertyName, fieldMetadata)
  }
}
