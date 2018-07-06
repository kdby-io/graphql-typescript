import { getTypeMetadata } from '../services';

// Class Decorator
export function Input(model: Function) {
  const typeMetadata = getTypeMetadata(model.prototype)
  typeMetadata.setIsInput()
  // const typeMetadata = getTypeMetadata(model.prototype)
  // const fieldLiterals: string[] = []
  // forEach(typeMetadata.fieldMetadataMap, (fieldMetadata, fieldName) => {
  //   if (fieldMetadata.resolver) {
  //     throw new Error('An Input must have only scalar type fields')
  //   }
  //   fieldLiterals.push(getFieldLiteral(model.prototype, fieldName))
  // })
  // const literal = `
  //   input ${model.name} {
  //     \t${fieldLiterals.join('\n\t')}
  //   }
  // `
  // setLiteral(model.prototype, literal)
}
