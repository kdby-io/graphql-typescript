# graphql-typescript [![npm](https://img.shields.io/npm/dt/graphql-typescript.svg?style=flat-square)](https://www.npmjs.com/package/graphql-typescript) [![CircleCI token](https://img.shields.io/circleci/token/13928c03d7e040db692e4a58e8a387a856d12fd7/project/github/vichyssoise/graphql-typescript/master.svg?style=flat-square)](https://circleci.com/gh/vichyssoise/graphql-typescript/tree/master) [![Coveralls github](https://img.shields.io/coveralls/github/vichyssoise/graphql-typescript/master.svg?style=flat-square)](https://coveralls.io/github/vichyssoise/graphql-typescript?branch=master) [![dependencies Status](https://david-dm.org/vichyssoise/graphql-typescript/status.svg?style=flat-square)](https://david-dm.org/vichyssoise/graphql-typescript)

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
import { Type, Field, Mutation, String, Boolean, Int, makeSchema } from 'graphql-typescript'

@Type class Query {
  @Field box: Box
}

@Type class Box {
  @Field size: Size
  @Mutation unbox(box: BoxModel, args: UnboxArguments, context: any): Boolean { ... }
}

@Type class Size {
  @Field height: Int
  @Field width: Int
  @Field length: Int
}

class UnboxArguments {
  @Field([String]) tools: String[]
}

const schema = makeSchema(Query, {
  model: [Size, Box]
})
```


### Prerequisites

Set decorator flags in your `tsconfig.json`

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```


### Installing

```
npm install -S graphql-typescript
```


## Type Definition

### `@Type`

Adding `@Type` to a class definition defines [GraphQL object type](http://graphql.org/learn/schema/#object-types-and-fields).

```ts
@Type class Character {
  @Field name: String
  @Field([Episode]) appearsIn: Episode[]
}
// type Character {
//   name: String!
//   appearsIn: [Episode]!
// }
```


### `@Field`

Adding `@Field` to properties or methods of a `@Type` decorated class defines what fields it has.
Property types or method return types must be one of the [Scalar types](#scalar-types) or your own GraphQL object types.

```ts
@Field hello: String
@Field hello(_:any, args: any, context: any): String { ... }
```

It is possible to specify field type by passing a single argument to `@Field`. In this case, a type annotation is ignored.

```ts
@Field(String) hello: any
@Field(String) hello(_: any, args: any, context: any) { ... }
```

If a field is list type, a argument of `@Field` would be like below.

```ts
@Field([String]) hello: String[]
@Field([String]) hello(_: any, args: any, context: any) { ... }
```


### `@Mutation`

Adding `@Mutation` to methods of a `@Type` decorated class defines a mutation. No matter which class it is in, it will come under [mutation type](http://graphql.org/learn/schema/#the-query-and-mutation-types).
Method return types must be one of the [Scalar types](#scalar-types) or your own GraphQL object types.

```ts
@Mutation hello(_: any, args: Argument, context: any): String { ... }
```

It is possible to specify mutation return type by passing a single argument to `@Mutation`. In this case, a type annotation is ignored.

```ts
@Mutation(String) hello(_: any, args: Argument, context: any) { ... }
```

If a mutation returns list type, a argument of `@Mutation` would be like below.

```ts
@Mutation([String]) hello(_: any, args: Argument, context: any) { ... }
```


### `@Nullable`

All fields and mutations are Non-null type by default.
Adding `@Nullable to fields or mutations properties make it nullable.

```ts
@Nullable @Field(String) hello: any
```


### `@Input`

Adding `@Input` to a class definition defines [a input type](http://graphql.org/learn/schema/#input-types)
An input class can only have `@Field` properties.

```ts
@Input class AddCharacterInput {
  @Field name: String
  @Field age: String
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
@Type class Box {
  @Mutation unbox(box: BoxModel, args: UnboxArguments): Boolean { ... }
}

class UnboxArguments {
  @Field([String]) tools: String[]
}
```

Then request query can be like below.

```graphql
query {
  box {
    unbox(tools: ["pen", "pencil"])
  }
}
```

To use input type in argument, do like below.

```ts
@Type class Box {
  @Mutation unbox(box: BoxModel, args: UnboxArguments): Boolean { ... }
}

@Input class UnboxInput {
  @Field([String]) tools: String[]
}

class UnboxArguments {
  @Field inputs: UnboxInput
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
  models: [ ... ]
})
```

- `rootType`: A root type of schema
- `models`: Rest of types except a root type