import { getFields, generateFieldLiteral, setLiteral } from '../services'
import { map } from 'lodash';
import { FieldDescriptor } from '..';

// Class Decorator
export function Type(model: Function) {
  const fields = getFields(model.prototype)
  const fieldLiterals = map(fields, (_: FieldDescriptor, fieldName) => {
    return generateFieldLiteral(model.prototype, fieldName)
  })
  const literal = `
    type ${model.name} {
      \t${fieldLiterals.join('\n\t')}
    }
  `
  setLiteral(model.prototype, literal)
}
