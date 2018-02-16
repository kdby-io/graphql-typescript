import { getProperties, setLiteral, getPropertyLiteral } from '../services'
import { forEach } from 'lodash'

// Class Decorator
export function Type(model: Function) {
  const properties = getProperties(model.prototype)
  const propertyLiterals: string[] = []
  forEach(properties, (property, propertyName) => {
    if (property.isMutation) return
    propertyLiterals.push(getPropertyLiteral(model.prototype, propertyName))
  })
  const literal = `
    type ${model.name} {
      \t${propertyLiterals.join('\n\t')}
    }
  `
  setLiteral(model.prototype, literal)
}
