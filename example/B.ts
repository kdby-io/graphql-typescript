import { Type, Field, String } from "../src";
import { A } from "./A";

@Type
export class B {
  @Field(() => String) c: string
  @Field(() => String) a: string
  @Field(() => A) b: A
}