import 'reflect-metadata'

import {
  Type, Field, Nullable, Mutation, Input,
  String, Boolean, ID, Int, Float,
  makeSchema,
} from '../src'
import { B } from './B';

// @Type
// class B {
//   @Field(() => String) c: string
//   @Field(() => String) a: string
// }

@Input
class AddUserInput {
  @Field(() => String) phone: string
}

class AddUserArguments {
  @Field(() => String) email: string
  @Field(() => String) password: string
  @Field(() => AddUserInput) input: AddUserInput
}

class EmptyArgument {}

@Input
class AddCreatorInput {
  @Field(() => String) phone: string
}

@Input
class AddCreatorArguments {
  @Field(() => String) email: string
  @Field(() => String) password: string
  @Field(() => AddCreatorInput) options: AddCreatorInput
}

@Type
export class A {
  @Field(() => String) a: string
  @Field(() => Boolean) b: boolean
  @Field(() => String) c: string
  @Field(() => ID) d: string
  @Field(() => Int) e: number
  @Field(() => Float) f: number

  @Field(() => String) h: string // String!
  @Field(() => String) i: number // String! (override)
  @Field(() => [ID]) j: string[] // [ID]!  배열은 이 방법 뿐임.
  // @Field k: string[]  // EEEEEEEEEEEError.

  @Field(() => B) l: B

  @Nullable @Field(() => String) n?: string // String

  // resolver가 있는 field도 동일.

  @Field(() => [B])
  z(_creator: string, _args: AddCreatorArguments, _req: any): B[] {
    return [new B()]
  }

  @Mutation(() => B)
  async y(_creator: A, _args: AddUserArguments, _req: any) {
    return name
  }

  @Mutation(() => B)
  async x(_creator: A, _args: EmptyArgument, _req: any) {
    return name
  }
}

makeSchema(A, {
  types: [B, AddUserInput, AddCreatorInput],
})
