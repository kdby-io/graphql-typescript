
import { FieldDescriptor } from '..'
import { createField } from './Field'
import { addMutation } from '../services'

export function Mutation(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor): void
export function Mutation(type: Function|[Function]): Function
export function Mutation(...args: any[]): Function | void {

  let type: Function|[Function]
  let options: Partial<FieldDescriptor>

  if(args.length === 1 && args[0] instanceof Function) {

    type = args[0] as Function
    options = { type: type.name }

    return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const field = createField(prototype, propertyKey, descriptor, options)
      addMutation(prototype, propertyKey, field)
    }

  } else if (args.length === 1 && args[0] instanceof Array) {

    type = args[0] as [Function]
    options = { type: type[0].name, isList: true }

    return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const field = createField(prototype, propertyKey, descriptor, options)
      addMutation(prototype, propertyKey, field)
    }
    
  } else {

    const [ prototype, propertyKey, descriptor ] = args
    const field = createField(prototype, propertyKey, descriptor)
    addMutation(prototype, propertyKey, field)

  }

}