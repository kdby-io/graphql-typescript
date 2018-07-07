import { TypeMetadata } from "./metadata/TypeMetadata";

const metadataStorage: { [typeName: string]: TypeMetadata } = {}

export function getTypeMetadata(prototype: any): TypeMetadata {
  const typeName = prototype.constructor.name
  metadataStorage[typeName] = metadataStorage[typeName] || new TypeMetadata(prototype)

  return metadataStorage[typeName]
}