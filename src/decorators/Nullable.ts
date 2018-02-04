import { setFieldOptions } from '../services'

export function Nullable(prototype: any, propertyKey: string) {
  setFieldOptions(prototype, propertyKey, { nullable: true })
}