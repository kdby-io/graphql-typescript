import { Input, Type, Field, String, Mutation } from '../../src'
import { getLiteral } from '../../src/services'

describe('@Type', () => {
  it('sets literal of target', () => {
    @Type class A {}

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*\}/)
  })

  it('sets literal of target with a property field', () => {
    @Type class A { @Field hello: String }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*hello: String!(.|\n)*\}/)
  })

  it('sets literal of target with a method field', () => {
    @Input class Argument { @Field arg1: String }
    @Type class A { @Field(String) hello(_: any, _args: Argument) {} }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*hello\(arg1: String!\): String!(.|\n)*\}/)
  })

  it('sets literal of target with mutation method', () => {
    @Input class Argument { @Field arg1: String }
    @Type class A { @Mutation(String) hello(_: any, _args: Argument) {} }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*\}/)
  })
})
