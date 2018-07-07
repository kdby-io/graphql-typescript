import { getTypeMetadata } from "../storage";

export function Nullable(prototype: any, propertyName: string) {
  getTypeMetadata(prototype).fieldMetadataMap[propertyName].setNullable()
}