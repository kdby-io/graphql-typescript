import { setLiteral, getFields, generateFieldLiteral } from '../services'
import { map } from 'lodash';
import { FieldDescriptor } from '..';

// Class Decorator
export function Input(model: Function) {
  const fields = getFields(model.prototype)
  const fieldLiterals = map(fields, (_: FieldDescriptor, fieldName) => {
    return generateFieldLiteral(model.prototype, fieldName)
  })
  const literal = `
    input ${model.name} {
      \t${fieldLiterals.join('\n\t')}
    }
  `
  setLiteral(model.prototype, literal)
}
