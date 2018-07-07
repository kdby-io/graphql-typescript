import { getTypeMetadata } from "../storage";

// Class Decorator
export function Input(model: Function) {
  const typeMetadata = getTypeMetadata(model.prototype)
  typeMetadata.setIsInput()
  Object.values(typeMetadata.fieldMetadataMap).forEach(fieldMetadata => {
    if (fieldMetadata.resolver) {
      throw new Error('An Input must have only scalar type fields')
    }
  })
}
