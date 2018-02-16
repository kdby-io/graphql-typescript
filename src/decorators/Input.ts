import { setLiteral, getProperties, getPropertyLiteral } from '../services'
import { map } from 'lodash'
import { Property } from '..'

// Class Decorator
export function Input(model: Function) {
  const properties = getProperties(model.prototype)
  const propertyLiterals = map(properties, (property: Property, propertyName) => {
    if (property.resolver) {
      throw new Error('An Input must have only scalar type fields')
    }
    return getPropertyLiteral(model.prototype, propertyName)
  })
  const literal = `
    input ${model.name} {
      \t${propertyLiterals.join('\n\t')}
    }
  `
  setLiteral(model.prototype, literal)
}
