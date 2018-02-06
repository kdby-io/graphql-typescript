import { String, Mutation } from '../../src'

// right
// @Mutation hello(_, args: Argument): String {}
// @Mutation(String) hello(_, args: Argument) {}
// @Mutation([String]) hello(_, args: Argument) {}

// // wrong
// @Mutation hello(_, args: Argument) {}
// @Mutation hello(_, args: Argument): { hello: 'world' } {}
// @Mutation hello(_, args: Argument): [String] {}
// @Mutation() hello(_, args: Argument) {}
// @Mutation([]) hello(_, args: Argument) {}

describe('@Mutation', () => {
  it(`adds a mutation to target if with a parameter`, () => {
    class A { @Mutation(String) hello() { return '' }}

    const mutation = Reflect.getMetadata('graphql:mutations', A.prototype).hello
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('type', String)
  })

  it(`adds a mutation to target if with a array parameter`, () => {
    class A { @Mutation([String]) hello() { return '' }}

    const mutation = Reflect.getMetadata('graphql:mutations', A.prototype).hello
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', true)
    expect(mutation).toHaveProperty('type', String)
  })

  it(`adds a mutation to target if with a returntype`, () => {
    class A { @Mutation hello(): String { return '' }}

    const mutation = Reflect.getMetadata('graphql:mutations', A.prototype).hello
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('type', String)
  })

  it(`throws an error if without parameter or returntype`, () => {
    try {
      class A { @Mutation hello() { }} A
    } catch (e) {
      expect(e).toHaveProperty('message', '@Field 데코레이터에 반환 타입 명시가 필요함')
    }
  })

  it(`throws an error if with a array returntype`, () => {
    try {
      class A { @Mutation hello() { }} A
    } catch (e) {
      expect(e).toHaveProperty('message', '@Field 데코레이터에 반환 타입 명시가 필요함')
    }
  })

  it(`throws an error if with a object returntype`, () => {
    try {
      class A { @Mutation hello() { }} A
    } catch (e) {
      expect(e).toHaveProperty('message', '@Field 데코레이터에 반환 타입 명시가 필요함')
    }
  })
})