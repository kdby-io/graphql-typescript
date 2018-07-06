import 'reflect-metadata'
import {
  getLiteral,
  getFieldLiteral,
} from '../src/services'
import { String } from '../src'

describe('getLiteral', () => {
  it(`returns literal of target`, () => {
    class A {}
    Reflect.defineMetadata('graphql:literal', 'hello', A.prototype)
    const literal = getLiteral(A.prototype)

    expect(literal).toMatch(/hello/)
  })
})


// describe('getPropertyLiteral', () => {
//   it('returns a property literal', () => {
//     class A {}
//     const property = { type: String, isList: false, nullable: false, isMutation: false }
//     Reflect.defineMetadata('graphql:properties', { hello: property }, A.prototype)

//     const literal = getPropertyLiteral(A.prototype, 'hello')
//     expect(literal).toMatch(/hello: String!/)
//   })

//   it('returns a list type property literal if isList is true', () => {
//     class A {}
//     const property = { type: String, isList: true, nullable: false, isMutation: false }
//     Reflect.defineMetadata('graphql:properties', { hello: property }, A.prototype)

//     const literal = getPropertyLiteral(A.prototype, 'hello')
//     expect(literal).toBe(`hello: [String]!`)
//   })

//   it('returns a nullable type property literal if nullable is true', () => {
//     class A {}
//     const property = { type: String, isList: false, nullable: true, isMutation: false }
//     Reflect.defineMetadata('graphql:properties', { hello: property }, A.prototype)

//     const literal = getPropertyLiteral(A.prototype, 'hello')
//     expect(literal).toBe(`hello: String`)
//   })

//   it('returns a property literal with parameter if resolver is exists', () => {
//     class Arguments {}
//     const argumentProperty = { isList: false, nullable: false, type: String, isMutation: false }
//     Reflect.defineMetadata('graphql:properties', { hello: argumentProperty }, Arguments.prototype)
//     class A {}
//     const property = { isList: false, nullable: false, type: String, resolver: () => {}, isMutation: false }
//     Reflect.defineMetadata('graphql:properties', { hello: property }, A.prototype)
//     Reflect.defineMetadata('design:paramtypes', [Object, Arguments], A.prototype, 'hello')

//     const literal = getPropertyLiteral(A.prototype, 'hello')
//     expect(literal).toMatch(/hello\(hello: String!\): String!/)
//   })

//   it('returns a property literal if it is a mutation', () => {
//     class A {}
//     const property = { type: String, isList: false, nullable: false, resolver: () => {}, isMutation: true }
//     Reflect.defineMetadata('graphql:properties', { hello: property }, A.prototype)

//     const literal = getPropertyLiteral(A.prototype, 'hello')
//     expect(literal).toMatch(/extend type Mutation \{(.|\n)*hello: String!(.|\n)*\}/)
//   })
// })
