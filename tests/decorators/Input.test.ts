import { Input, Field, String } from '../../src'
import { getTypeMetadata } from '../../src/storage';

describe('@Input', () => {
  it('sets literal of target', () => {
    @Input class A {}

    const literal = getTypeMetadata(A.prototype).getLiteral()
    expect(literal).toMatch(/input A \{(.|\n)*\}/)
  })

  it('sets literal of target with a property field', () => {
    @Input class A { @Field(() => String) hello: string }

    const literal = getTypeMetadata(A.prototype).getLiteral()
    expect(literal).toMatch(/input A \{(.|\n)*hello: String!(.|\n)*\}/)
  })

  it('throws an error if target has a method field', () => {
    try {
      @Input
      class A {
        @Field(() => String) hello(_: any, _args: string) {}
      } A

    } catch (e) {
      expect(e.message).toBe('An Input must have only scalar type fields')
    }
  })
})
