import { Type, Field, String, Mutation } from '../../src'
import { getLiteral } from '../../src/services'

describe('@Type', () => {
  it('sets literal of target', () => {
    @Type class A {}

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*\}/)
  })

  it('sets literal of target with a method field', () => {
    class Argument {
      @Field(() => String) arg1: string
    }
    @Type class A {
      @Field(() => String)
      hello(_: any, _args: Argument) {}
    }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*hello\(arg1: String!\): String!(.|\n)*\}/)
  })

  it('sets literal of target with mutation method', () => {
    class Argument { @Field(() => String) arg1: string }
    @Type class A { @Mutation(() => String) hello(_: any, _args: Argument) {} }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/type A \{(.|\n)*\}/)
  })
})
