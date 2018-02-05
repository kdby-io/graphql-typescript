import { getFields, setLiteral, getFieldLiteral } from '../services'
import { map } from 'lodash'
import { FieldDescriptor } from '..'

// Class Decorator
export function Type(model: Function) {
  const fields = getFields(model.prototype)
  const fieldLiterals = map(fields, (_: FieldDescriptor, fieldName) => {
    return getFieldLiteral(model.prototype, fieldName)
  })
  const literal = `
    type ${model.name} {
      \t${fieldLiterals.join('\n\t')}
    }
  `
  setLiteral(model.prototype, literal)
}
