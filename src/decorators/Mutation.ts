
import { FieldDescriptor } from '..'
import { addMutation, createField } from '../services'

export function Mutation(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor): void
export function Mutation(type: Function|[Function]): Function
export function Mutation(...args: any[]): Function | void {

  let type: Function|[Function]
  let options: Partial<FieldDescriptor>

  if(args.length === 1) {
    switch (args[0].constructor) {

      // with a type argument
      case Function:
        type = args[0] as Function
        options = { type }

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const field = createField(prototype, propertyKey, descriptor, options)
          addMutation(prototype, propertyKey, field)
        }


      // with a array type argument
      case Array:
        type = args[0] as [Function]
        options = { type: type[0], isList: true }

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const field = createField(prototype, propertyKey, descriptor, options)
          addMutation(prototype, propertyKey, field)
        }
    

      // with a wrong argument
      default:
        throw new Error('잘못된 입력')
    }


  } else {
    const [ prototype, propertyKey, descriptor ] = args
    const field = createField(prototype, propertyKey, descriptor)
    addMutation(prototype, propertyKey, field)
  }
}