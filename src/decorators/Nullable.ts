import { getTypeMetadata } from '../services'

export function Nullable(prototype: any, propertyName: string) {
  getTypeMetadata(prototype).fieldMetadataMap[propertyName].setNullable()
}