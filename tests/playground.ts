import 'reflect-metadata'

import {
  Type, Field, Nullable, Mutation, Input,
  String, Boolean, ID, Int, Float,
  makeSchema,
} from '../src'

@Type
class B {
  @Field c: String
  @Field a: String
}

@Input
class AddUserInput {
  @Field phone: String
}

class AddUserArguments {
  @Field email: String
  @Field password: String
  @Field input: AddUserInput
}

class EmptyArgument {}

@Input
class AddCreatorInput {
  @Field phone: String
}

@Input
class AddCreatorArguments {
  @Field email: String
  @Field password: String
  @Field options: AddCreatorInput
}

@Type
class A {
  @Field a: String // String!
  @Field b: Boolean // Boolean!
  @Field c: Int // String!
  @Field d: ID // ID!
  @Field e: Int // Int!
  @Field f: Float // Float!

  @Field(String) h: string // String!
  @Field(String) i: number // String! (override)
  @Field([ID]) j: string[] // [ID]!  배열은 이 방법 뿐임.
  // @Field k: string[]  // EEEEEEEEEEEError.

  @Field l: B // B!
  @Field(B) m: B // B!

  @Nullable @Field n?: String // String

  // resolver가 있는 field도 동일.

  @Field([B])
  z(_creator: string, _args: AddCreatorArguments, _req: Request): B[] {
    return [new B()]
  }

  @Mutation(B)
  async y(_creator: A, _args: AddUserArguments, _req: Request) {
    return name
  }

  @Mutation(B)
  async x(_creator: A, _args: EmptyArgument, _req: Request) {
    return name
  }
}

makeSchema(A, {
  types: [B, AddUserInput, AddCreatorInput],
})
