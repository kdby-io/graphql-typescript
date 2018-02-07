import { FieldDescriptor } from '..'
import { addField, createFieldDescriptor } from '../services'

export function Field(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor): void
export function Field(type: Function | [Function]): Function
export function Field(...args: any[]): Function | void {

  let type: Function | [Function]
  let options: Partial<FieldDescriptor>

  if(args.length === 1) {
    switch (args[0].constructor) {
      
      // with a type argument
      case Function:
        type = args[0] as Function
        options = { type }

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const field = createFieldDescriptor(prototype, propertyKey, descriptor, options)
          addField(prototype, propertyKey, field)
        }

      // with a array type argument
      case Array:
        type = args[0] as [Function]
        options = { type: type[0], isList: true }

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const field = createFieldDescriptor(prototype, propertyKey, descriptor, options)
          addField(prototype, propertyKey, field)
        }


      // with a wrong argument
      default:
        throw new Error(`A argument of @Field must be a type or a array type`)
    }


  // without argument
  } else {
    const [prototype, propertyKey, descriptor] = args
    const field = createFieldDescriptor(prototype, propertyKey, descriptor)
    addField(prototype, propertyKey, field)
  }
}
