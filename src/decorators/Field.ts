import { FieldDescriptor } from '..'
import { addField } from '../services'

export function Field(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor): void
export function Field(type: Function|[Function]): Function
export function Field(...args: any[]): Function | void {

  let type: Function|[Function]
  let options: Partial<FieldDescriptor>

  if(args.length === 1 && args[0] instanceof Function) {

    type = args[0] as Function
    options = { type: type.name }

    return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const field = createField(prototype, propertyKey, descriptor, options)
      addField(prototype, propertyKey, field)
    }

  } else if (args.length === 1 && args[0] instanceof Array) {

    type = args[0] as [Function]
    options = { type: type[0].name, isList: true }

    return (prototype: any, propertyKey: string, descriptor: PropertyDescriptor) => {
      const field = createField(prototype, propertyKey, descriptor, options)
      addField(prototype, propertyKey, field)
    }

  } else {

    const [ prototype, propertyKey, descriptor ] = args
    const field = createField(prototype, propertyKey, descriptor)
    addField(prototype, propertyKey, field)

  }
}


export function createField(prototype: any, propertyKey: string, descriptor?: PropertyDescriptor, options?: Partial<FieldDescriptor>) {
  let field: Partial<FieldDescriptor> = {
    nullable: false,
    isList: false,
  }

  if (options && options.type) {

    field = {
      ...field,
      ...options,
    }

  } else {

    const fieldType: string = Reflect.getMetadata('design:type', prototype, propertyKey).name

    switch (fieldType) {
      // with resolver
      case 'Function':
        const fieldReturnType = Reflect.getMetadata('design:returntype', prototype, propertyKey)
        if (!fieldReturnType || fieldReturnType.name === 'Promise') {
          throw new Error('Fucking Promise')
        }
        field.type = fieldReturnType

        // TODO: set argument type
        break;

      case 'Array':
      case 'Object':
        throw new Error(`Specify field type of '${propertyKey}' in '${prototype.constructor.name}' `)

      default:
        field.type = fieldType
        break;
    }

  }

  if (descriptor && descriptor.value) {
    field.resolver = descriptor.value
  }

  return field as FieldDescriptor
}

