import { String, Mutation } from '../../src'
import { getTypeMetadata } from '../../src/storage';

describe('@Mutation', () => {
  it(`adds a mutation to target if with a parameter`, () => {
    class A { @Mutation(() => String) hello() { return '' }}

    const typeMetadata = getTypeMetadata(A.prototype)
    const mutation = typeMetadata.fieldMetadataMap['hello']
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation.typeFunc()).toBe(String)
    expect(mutation).toHaveProperty('isMutation', true)
  })

  it(`adds a mutation to target if with a array parameter`, () => {
    class A { @Mutation(() => [String]) hello() { return '' }}

    const typeMetadata = getTypeMetadata(A.prototype)
    const mutation = typeMetadata.fieldMetadataMap['hello']
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', true)
    expect(mutation.typeFunc()).toHaveProperty('0', String)
    expect(mutation).toHaveProperty('isMutation', true)
  })

  it(`throws an error if with a wrong argument`, () => {
    try {
      class A { @Mutation({} as any) hello() { }} A
    } catch (e) {
      expect(e.message).toBe(`A argument of @Mutation must be a function`)
    }
  })
})