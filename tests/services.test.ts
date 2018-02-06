import 'reflect-metadata'
import {
  getLiteral,
  setLiteral,
  getFields,
  addField,
  getMutations,
  addMutation,
  getFieldLiteral,
  getMutationLiteral,
} from '../src/services'
import { String } from '../src'

describe('createField', () => {
})

describe('setLiteral', () => {
  it(`sets literal of target`, () => {
    class A {}
    setLiteral(A.prototype, 'hello')
    const literal = Reflect.getMetadata('graphql:literal', A.prototype)

    expect(literal).toMatch(/hello/)
  })
})

describe('getLiteral', () => {
  it(`returns literal of target`, () => {
    class A {}
    Reflect.defineMetadata('graphql:literal', 'hello', A.prototype)
    const literal = getLiteral(A.prototype)

    expect(literal).toMatch(/hello/)
  })
})

describe('addField', () => {
  it(`adds a field of target`, () => {
    class A {}
    addField(A.prototype, 'hello', { isList: false, nullable: false, type: String })
    const field = getFields(A.prototype).hello

    expect(field).toHaveProperty('isList', false)
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('type', String)
  })
})

describe('getFields', () => {
  it(`returns fields of target`, () => {
    class A {}
    Reflect.defineMetadata(
      'graphql:fields',
      { hello: { isList: false, nullable: false, type: String } },
      A.prototype
    )
    const field = getFields(A.prototype).hello

    expect(field).toHaveProperty('isList', false)
    expect(field).toHaveProperty('nullable', false)
    expect(field).toHaveProperty('type', String)
  })
})

describe('getMutations', () => {
  it(`returns mutations of target`, () => {
    class A {}
    const resolver = () => {}
    Reflect.defineMetadata(
      'graphql:mutations',
      { hello: { isList: false, nullable: false, type: String, resolver } },
      A.prototype
    )

    const mutation = getMutations(A.prototype).hello
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('nullable', false)
    expect(mutation).toHaveProperty('type', String)
    expect(mutation).toHaveProperty('resolver', resolver)
  })
})

describe('addMutation', () => {
  it(`adds mutations of target`, () => {
    class A {}
    const resolver = () => {}
    addMutation(A.prototype, 'hello', { isList: false, type: String, resolver })

    const mutation = Reflect.getMetadata('graphql:mutations', A.prototype).hello
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('isList', false)
    expect(mutation).toHaveProperty('isList', false)
  })
})

describe('getFieldLiteral', () => {
  it('returns a field literal', () => {
    class A {}
    const fieldDescriptor = { type: String, isList: false, nullable: false }
    Reflect.defineMetadata('graphql:fields', { hello: fieldDescriptor }, A.prototype)

    const literal = getFieldLiteral(A.prototype, 'hello')
    expect(literal).toMatch(/hello: String!/)
  })

  it('returns a list type field literal if isList is true', () => {
    class A {}
    const fieldDescriptor = { type: String, isList: true, nullable: false }
    Reflect.defineMetadata('graphql:fields', { hello: fieldDescriptor }, A.prototype)

    const literal = getFieldLiteral(A.prototype, 'hello')
    expect(literal).toBe(`hello: [String]!`)
  })

  it('returns a nullable type field literal if nullable is true', () => {
    class A {}
    const fieldDescriptor = { type: String, isList: false, nullable: true }
    Reflect.defineMetadata('graphql:fields', { hello: fieldDescriptor }, A.prototype)

    const literal = getFieldLiteral(A.prototype, 'hello')
    expect(literal).toBe(`hello: String`)
  })

  it('returns a field literal with parameter if resolver is exists', () => {
    class Arguments {}
    Reflect.defineMetadata(
      'graphql:fields',
      { hello: { isList: false, nullable: false, type: String } },
      Arguments.prototype
    )
    class A {}
    Reflect.defineMetadata(
      'graphql:fields',
      { hello: { isList: false, nullable: false, type: String, resolver: () => {} } },
      A.prototype
    )
    Reflect.defineMetadata('design:paramtypes', [Object, Arguments], A.prototype, 'hello')

    const literal = getFieldLiteral(A.prototype, 'hello')
    expect(literal).toMatch(/hello\(hello: String!\): String!/)
  })
})

describe('getMutationLiteral', () => {
  it('returns a mutation literal', () => {
    class A {}
    const mutationDescriptor = {
      type: String,
      isList: false,
      nullable: false,
      resolver: () => {},
    }
    Reflect.defineMetadata('graphql:mutations', { hello: mutationDescriptor }, A.prototype)

    const literal = getMutationLiteral(A.prototype, 'hello')
    expect(literal).toMatch(/extend type Mutation \{(.|\n)*hello: String!(.|\n)*\}/)
  })

  it('returns a list type mutation literal if isList is true', () => {
    class A {}
    const mutationDescriptor = { type: String, isList: true, nullable: false, resolver: () => {} }
    Reflect.defineMetadata('graphql:mutations', { hello: mutationDescriptor }, A.prototype)

    const literal = getMutationLiteral(A.prototype, 'hello')
    expect(literal).toMatch(/extend type Mutation \{(.|\n)*hello: \[String\]!(.|\n)*\}/)
  })

  it('returns a nullable type mutation literal if nullable is true', () => {
    class A {}
    const mutationDescriptor = { type: String, isList: false, nullable: true, resolver: () => {} }
    Reflect.defineMetadata('graphql:mutations', { hello: mutationDescriptor }, A.prototype)

    const literal = getMutationLiteral(A.prototype, 'hello')
    expect(literal).toMatch(/extend type Mutation \{(.|\n)*hello: String(.|\n)*\}/)
  })

  it('returns a mutation literal with parameter if resolver is exists', () => {
    class Arguments {}
    Reflect.defineMetadata(
      'graphql:fields',
      { hello: { isList: false, nullable: false, type: String } },
      Arguments.prototype
    )
    class A {}
    Reflect.defineMetadata(
      'graphql:mutations',
      { hello: { isList: false, nullable: false, type: String, resolver: () => {} } },
      A.prototype
    )
    Reflect.defineMetadata('design:paramtypes', [Object, Arguments], A.prototype, 'hello')

    const literal = getMutationLiteral(A.prototype, 'hello')
    expect(literal).toMatch(
      /extend type Mutation \{(.|\n)*hello\(hello: String!\): String!(.|\n)*\}/
    )
  })
})
