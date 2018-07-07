# graphql-typescript [![npm](https://img.shields.io/npm/v/graphql-typescript.svg?style=flat-square)](https://www.npmjs.com/package/graphql-typescript) [![npm](https://img.shields.io/npm/dt/graphql-typescript.svg?style=flat-square)](https://www.npmjs.com/package/graphql-typescript) [![CircleCI token](https://img.shields.io/circleci/token/13928c03d7e040db692e4a58e8a387a856d12fd7/project/github/vichyssoise/graphql-typescript/master.svg?style=flat-square)](https://circleci.com/gh/vichyssoise/graphql-typescript/tree/master) [![Coveralls github](https://img.shields.io/coveralls/github/vichyssoise/graphql-typescript/master.svg?style=flat-square)](https://coveralls.io/github/vichyssoise/graphql-typescript?branch=master) [![dependencies Status](https://david-dm.org/vichyssoise/graphql-typescript/status.svg?style=flat-square)](https://david-dm.org/vichyssoise/graphql-typescript)

Define and build GraphQL Schemas using typed classes

- [Type definition](#type-definition)
  + [`@Type`](#@type)
  + [`@Field`](#@field)
  + [`@Mutation`](#@mutation)
  + [`@Nullable`](#@nullable)
  + [`@Input`](#@input)
  + [Scalar types](#scalar-types)
- [Arguments](#arguments)
- [Generating GraphQL Schema](#generating-graphql-schema)


```ts
import { Type, Field, Nullable, Mutation, String, Boolean, Int, makeSchema } from 'graphql-typescript'

@Type class Query {
  @Field(() => Box) box: Box
}

class UnboxArguments {
  @Field(() => [String]) tools: string[]
}

@Type class Box {
  @Field(() => Size)
  size: Size

  @Nullable
  @Field(() => String)
  content: string

  @Mutation(() => Boolean)
  unbox(box: BoxModel, args: UnboxArguments, context: any) { ... }
}

@Type class Size {
  @Field(() => Int) height: number
  @Field(() => Int) width: number
  @Field(() => Int) length: number
}


const schema = makeSchema(Query, {
  types: [Size, Box]
})
```

```graphql
type Query {
  box: Box!
}

type Mutation {
  unbox(tools: [String]!): Boolean!
}

type Box {
  size: Size!
  content: String
}

type Size {
  height: Int!
  width: Int!
  length: Int!
}
```


### Prerequisites

Set decorator flags in your `tsconfig.json`

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```


### Installing

```
npm install -S graphql
npm install -S graphql-typescript
```


## Type Definition

### `@Type`

Adding `@Type` to a class definition defines [GraphQL object type](http://graphql.org/learn/schema/#object-types-and-fields).

```ts
@Type class Character {
  @Field(() => String) name: string
  @Field(() => [Episode]) appearsIn: Episode[]
}
```

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```


### `@Field`

Adding `@Field` to properties or methods of a `@Type` decorated class defines what fields it has.

```ts
@Type
class Hello {
  @Field(() => String)
  a: string

  @Field(() => [String])
  b: string[]

  @Field(() => String)
  c(_:any, _args: any, context: any) { ... }
}
```

```graphql
type Hello {
  a: String!
  b: [String]!
  c: String!
}
```


### `@Mutation`

Adding `@Mutation` to methods of a `@Type` decorated class defines a mutation. No matter which class it is in, it will come under [mutation type](http://graphql.org/learn/schema/#the-query-and-mutation-types).

```ts
class Argument {
  @Field(() => [Int]) world: number[]
}

@Type
class Hello {
  @Mutation(() => String)
  a(_: any, _args: any, context: any) { ... }

  @Mutation(() => [String])
  b(_: any, _args: any, context: any) { ... }

  @Mutation(() => String)
  c(_: any, args: Argument, context: any) { ... }
}
```

```graphql
type Mutation {
  ...
  a: String!
  b: [String]!
  c(world: [Int]!): String!
}
```


### `@Nullable`

All fields and mutations are Non-null type by default.
Adding `@Nullable to fields or mutations properties make it nullable.

```ts
@Type Hello {
  @Nullable
  @Field(() => String)
  hello: string
}
```

```graphql
type Hello {
  hello: String
}
```


### `@Input`

Adding `@Input` to a class definition defines [a input type](http://graphql.org/learn/schema/#input-types)
An input class can only have `@Field` properties.

```ts
@Input class AddCharacterInput {
  @Field(() => String) name: string
  @Field(() => Int) age: number
}
```

```graphql
input AddCharacterInput {
  name: String!
  age: Int!
}
```


### Scalar types

To use [GraphQL default scalar types](http://graphql.org/learn/schema/#scalar-types), import it from 'graphql-typescript'

```ts
import { String, Boolean, Int, Float, ID } from 'graphql-typescript'
```

## Arguments

All fields of GraphQL objects type can have arguments. Methods with `@Field` or `@Mutation` get request query arguments from second parameter.
It needs to define a argument class. Because a purpose of this class is only typing arguments, there is no class decorator and it can have only `@Field` properties.

```ts
class UnboxArguments {
  @Field(() => [String]) tools: string[]
}

@Type class Box {
  @Mutation(() => Boolean) unbox(box: BoxModel, args: UnboxArguments) { ... }
}
```

```graphql
type Mutation{
  unbox(tools: [String]!): Boolean
}
```

To use input type in argument, do like below.

```ts
@Input class UnboxInput {
  @Field(() => [String]) tools: string[]
}
class UnboxArguments {
  @Field(() => UnboxInput) inputs: UnboxInput
}

@Type class Box {
  @Mutation(() => Boolean) unbox(box: BoxModel, args: UnboxArguments) { ... }
}
```

```graphql
input UnboxInput {
  tools: [String]!
}

type Mutation{
  unbox(inputs: UnboxInput!): Boolean
}
```


## Generating GraphQL Schema

```ts
import { makeSchema } from 'graphql-typescript'
import { Query } from './Query'
import { Box } from './Box'
import { Character } from './Character'

const schema = makeSchema(Query, {
  models: [ Box, Character ]
})
```

### `makeSchema`

```ts
makeSchema(rootType, {
  types: [ ... ]
})
```

- `rootType`: A root type of schema
- `types`: Rest of types except a root type