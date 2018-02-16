import { String, Field } from '../../src'

// right
// @Field hello: String
// @Field(String) hello: any
// @Field([String]) hello: any
// @Field hello(_, args: Argument): String {}
// @Field(String) hello(_, args: Argument) {}
// @Field([String]) hello(_, args: Argument) {}

// // wrong
// @Field hello: any
// @Field hello: { hello: 'world' }
// @Field hello: [String]
// @Field() hello: any
// @Field([]) hello: any
// @Field hello(_, args: Argument) {}
// @Field hello(_, args: Argument): { hello: 'world' } {}
// @Field hello(_, args: Argument): [String] {}
// @Field() hello(_, args: Argument) {}
// @Field([]) hello(_, args: Argument) {}

describe('@Field', () => {
  it(`adds a field to target if with a parameter`, () => {
    class A { @Field(String) hello() { return '' }}

    const field = Reflect.getMetadata('graphql:properties', A.prototype).hello
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('isList', false)
    expect(field).toHaveProperty('type', String)
    expect(field).toHaveProperty('isMutation', false)
  })

  it(`adds a field to target if with a array parameter`, () => {
    class A { @Field([String]) hello() { return '' }}

    const field = Reflect.getMetadata('graphql:properties', A.prototype).hello
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('isList', true)
    expect(field).toHaveProperty('type', String)
    expect(field).toHaveProperty('isMutation', false)
  })

  it(`adds a field to target if with a returntype`, () => {
    class A { @Field hello(): String { return '' }}

    const field = Reflect.getMetadata('graphql:properties', A.prototype).hello
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('isList', false)
    expect(field).toHaveProperty('type', String)
    expect(field).toHaveProperty('isMutation', false)
  })

  it(`throws an error if without parameter or returntype`, () => {
    try {
      class A { @Field hello() { }} A
    } catch (e) {
      expect(e.message).toBe(`Specify field type of 'hello' in 'A'. ex) @Field(String)`)
    }
  })

  it(`throws an error if with a array returntype`, () => {
    try {
      class A { @Field hello() { }} A
    } catch (e) {
      expect(e.message).toBe(`Specify field type of 'hello' in 'A'. ex) @Field(String)`)
    }
  })

  it(`throws an error if with a object returntype`, () => {
    try {
      class A { @Field hello() { }} A
    } catch (e) {
      expect(e.message).toBe(`Specify field type of 'hello' in 'A'. ex) @Field(String)`)
    }
  })
})