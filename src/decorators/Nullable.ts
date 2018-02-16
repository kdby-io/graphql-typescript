import { setPropertyOptions } from '../services'

export function Nullable(prototype: any, propertyName: string) {
  setPropertyOptions(prototype, propertyName, { nullable: true })
}