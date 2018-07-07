import {
  Type, Field, Nullable, Mutation, Input,
  String, Boolean, ID, Int, Float,
} from '../src'
import { B } from './B';

@Input
export class YInput {
  @Field(() => String) phone: string
}
class YArguments {
  @Field(() => String) email: string
  @Field(() => String) password: string
  @Field(() => YInput) input: YInput
}

class EmptyArgument {}

@Input
export class ZInput {
  @Field(() => String) phone: string
}
@Input
class ZArguments {
  @Field(() => String) email: string
  @Field(() => String) password: string
  @Field(() => ZInput) options: ZInput
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
  z(_creator: string, _args: ZArguments, _req: any): B[] {
    return [new B()]
  }

  @Mutation(() => B)
  async y(_creator: A, _args: YArguments, _req: any) {
    return ''
  }

  @Mutation(() => B)
  async x(_creator: A, _args: EmptyArgument, _req: any) {
    return ''
  }
}