import { Input, Field, String } from '../../src'
import { getLiteral } from '../../src/services'

describe('@Input', () => {
  it('sets literal of target', () => {
    @Input class A {}

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/input A \{(.|\n)*\}/)
  })

  it('sets literal of target with a property field', () => {
    @Input class A { @Field(() => String) hello: string }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/input A \{(.|\n)*hello: String!(.|\n)*\}/)
  })

  it('throws an error if target has a method field', () => {
    try {
      class Argument { @Field(() => String) arg1: string }
      @Input class A { @Field(() => String) hello(_: any, _args: Argument) {} } A
    } catch (e) {
      expect(e.message).toBe('An Input must have only scalar type fields')
    }
  })
})
