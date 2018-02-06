import { Input, Field, String } from '../../src'
import { getLiteral } from '../../src/services'

describe('@Input', () => {
  it('sets literal of target', () => {
    @Input class A {}

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/input A \{(.|\n)*\}/)
  })

  it('sets literal of target with a property field', () => {
    @Input class A { @Field hello: String }

    const literal = getLiteral(A.prototype)
    expect(literal).toMatch(/input A \{(.|\n)*hello: String!(.|\n)*\}/)
  })

  it('throws an error if target has a method field', () => {
    try {
      @Input class Argument { @Field arg1: String }
      @Input class A { @Field(String) hello(_: any, _args: Argument) {} } A
    } catch (e) {
      expect(e).toHaveProperty('message', 'An input type must have only scalar type fields')
    }
  })
})
