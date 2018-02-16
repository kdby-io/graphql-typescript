import { Property } from '..'
import { addProperty, createProperty } from '../services'

export function Mutation(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor): void
export function Mutation(type: Function|[Function]): Function
export function Mutation(...args: any[]): Function | void {

  const options: Partial<Property> = {
    isMutation: true
  }

  if(args.length === 1) {
    switch (args[0].constructor) {

      // with a type argument
      case Function:
        options.type = args[0]

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const property = createProperty(prototype, propertyKey, descriptor, options)
          addProperty(prototype, propertyKey, property)
        }


      // with a array type argument
      case Array:
        options.type = args[0][0]
        options.isList = true

        return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
          const property = createProperty(prototype, propertyKey, descriptor, options)
          addProperty(prototype, propertyKey, property)
        }
    

      // with a wrong argument
      default:
        throw new Error('A argument of @Mutation must be a type or a array type')
    }


  // without argument
  } else {
    const [ prototype, propertyName, descriptor ] = args
    const property = createProperty(prototype, propertyName, descriptor, options)
    addProperty(prototype, propertyName, property)
  }
}
