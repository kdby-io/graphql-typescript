import { Property } from '..'
import { addProperty, createProperty } from '../services'

export function Field(prototype: any, propertyName: string, descriptor?: PropertyDescriptor): void
export function Field(type: Function | [Function]): Function
export function Field(...args: any[]): Function | void {

  const options: Partial<Property> = {
    isMutation: false
  }

  if(args.length === 1) {
    switch (args[0].constructor) {
      
      // with a type argument
      case Function:
        options.type = args[0]

        return (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => {
          const field = createProperty(prototype, propertyName, descriptor, options)
          addProperty(prototype, propertyName, field)
        }


      // with a array type argument
      case Array:
        options.type = args[0][0]
        options.isList = true

        return (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => {
          const field = createProperty(prototype, propertyName, descriptor, options)
          addProperty(prototype, propertyName, field)
        }


      // with a wrong argument
      default:
        throw new Error(`A argument of @Field must be a type or a array type`)
    }


  // without argument
  } else {
    const [prototype, propertyKey, descriptor] = args
    const field = createProperty(prototype, propertyKey, descriptor, options)
    addProperty(prototype, propertyKey, field)
  }
}
