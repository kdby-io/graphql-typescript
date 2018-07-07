import { String, Field } from '../../src'
import { getTypeMetadata } from '../../src/storage';

describe('@Field', () => {
  it(`adds a field to target if with a parameter`, () => {
    class A {
      @Field(() => String)
      hello() { return '' }
    }

    const typeMetadata = getTypeMetadata(A.prototype)
    const field = typeMetadata.fieldMetadataMap['hello']
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('isList', false)
    expect(field.typeFunc()).toBe(String)
    expect(field).toHaveProperty('isMutation', false)
  })

  it(`adds a field to target if with a array parameter`, () => {
    class A { @Field(() => [String]) hello() { return '' }}

    const typeMetadata = getTypeMetadata(A.prototype)
    const field = typeMetadata.fieldMetadataMap['hello']
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('isList', true)
    expect(field.typeFunc()).toHaveProperty('0', String)
    expect(field).toHaveProperty('isMutation', false)
  })

  it(`throws an error if with a wrong argument`, () => {
    try {
      class A { @Field({} as any) hello() { }} A
    } catch (e) {
      expect(e.message).toBe(`A argument of @Field must be a function`)
    }
  })
})