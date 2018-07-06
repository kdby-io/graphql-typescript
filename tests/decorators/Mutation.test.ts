import { String, Mutation } from '../../src'
import { TypeMetadata } from '../../src/metadata/TypeMetadata';

// right
// @Mutation(String) hello(_, args: Argument) {}
// @Mutation([String]) hello(_, args: Argument) {}

// // wrong
// @Mutation hello(_, args: Argument) {}
// @Mutation hello(_, args: Argument): { hello: 'world' } {}
// @Mutation hello(_, args: Argument): [String] {}
// @Mutation() hello(_, args: Argument) {}
// @Mutation([]) hello(_, args: Argument) {}
// @Mutation hello(_, args: Argument): String {}

describe('@Mutation', () => {
  it(`adds a mutation to target if with a parameter`, () => {
    class A { @Mutation(() => String) hello() { return '' }}

    const typeMetadata: TypeMetadata = Reflect.getMetadata('graphql:metadata', A.prototype)
    const mutation = typeMetadata.fieldMetadataMap['hello']
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation.typeFunc()).toBe(String)
    expect(mutation).toHaveProperty('isMutation', true)
  })

  it(`adds a mutation to target if with a array parameter`, () => {
    class A { @Mutation(() => [String]) hello() { return '' }}

    const typeMetadata: TypeMetadata = Reflect.getMetadata('graphql:metadata', A.prototype)
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