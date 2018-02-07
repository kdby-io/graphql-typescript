# graphql-typescript

Decorators????????

- [Type definition](#type-definition)
  + [`@Type`](#@type)
  + [`@Field`](#@field)
  + [`@Mutation`](#@mutation)
  + [`@Nullable`](#@nullable)
  + [`@Input`](#@input)
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

클래스 선언 앞에 `@Type`을 붙여 [GraphQL object type](http://graphql.org/learn/schema/#object-types-and-fields)을 정의할 수 있습니다.

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

`@Type`이 붙은 클래스의 프로퍼티나 메소드에 `@Field`를 붙혀서 해당 타입의 필드를 정의할 수 있습니다.
프로퍼티의 타입이나 메소드의 반환타입은 당신이 정의한 다른 타입이나 'graphql-typescript'가 정의한 기본 스칼라 타입이어야 합니다.

```ts
@Field hello: String
@Field hello(_:any, args: any, context: any): String { ... }
```

반환타입을 명시하지 않고 `@Field`의 파라미터로 해당 필드의 반환타입을 지정할 수 있습니다.

```ts
@Field(String) hello: any
@Field(String) hello(_: any, args: any, context: any) { ... }
```

만약 반환타입이 리스트라면 `@Field`의 파라미터로 반환타입을 지정해야 합니다.

```ts
@Field([String]) hello: String[]
@Field([String]) hello(_: any, args: any, context: any) { ... }
```


### `@Mutation`

`@Type`이 붙은 클래스의 메소드에 `@Mutation`를 붙혀서 뮤테이션을 정의할 수 있습니다.
뮤테이션은 어느 클래스 안에 있던 상관없습니다.
메소드의 반환타입은 당신이 정의한 다른 타입이나 'graphql-typescript'가 정의한 기본 스칼라 타입이어야 합니다.

```ts
@Mutation hello(_: any, args: Argument, context: any): String { ... }
```

반환타입을 명시하지 않고 `@Mutation`의 파라미터로 해당 필드의 반환타입을 지정할 수 있습니다.

```ts
@Mutation(String) hello(_: any, args: Argument, context: any) { ... }
```

만약 반환타입이 리스트라면 `@Mutation`의 파라미터로 반환타입을 지정해야 합니다.

```ts
@Mutation([String]) hello(_: any, args: Argument, context: any) { ... }
```


### `@Nullable`

필드나 뮤테이션의 반환값이 없을 수 있다면 `@Field`나 `@Mutation` 앞에 `@Nullable`을 붙여서 

```ts
@Nullable @Field(String) hello: any
```


### `@Input`

클래스 선언 앞에 `@Input`을 붙여 input type을 정의할 수 있습니다.

```ts
@Input class AddCharacterInput {
  @Field name: String
  @Field age: String
}
```

`@Input`이 있는 클래스는 오직 `@Field`를 가진 프로퍼티만 있어야 합니다. 메소드나 `@Mutation` 필드를 선언할 수 없습니다.


### Scalar types

필드나 뮤테이션을 [GraphQL의 기본 스칼라 타입](http://graphql.org/learn/schema/#scalar-types)으로 하기 위해선 `graphql-typescript`로 부터 임포트해야합니다. 

```ts
import { String, Boolean, Int, Float, ID } from 'graphql-typescript'
```

## Arguments

모든 GraphQL object type의 필드는 arguments를 가질 수 있습니다. `@Field`나 `@Mutation`이 붙은 메소드는 두번째 인자로 요청 쿼리의 arguments를 가져옵니다.

arguments의 형태를 클래스로 정의하여 타입으로 선언하여 사용합니다. 해당 클래스는 decorator가 없이 선언되고, 오직 `@Field`가 붙은 프로퍼티만 있어야 합니다.

```ts
@Type class Box {
  @Mutation unbox(box: BoxModel, args: UnboxArguments): Boolean { ... }
}

class UnboxArguments {
  @Field([String]) tools: String[]
}
```

그러면 요청 쿼리를 아래와 같이 보낼 수 있습니다.

```graphql
query {
  box {
    unbox(tools: ["pen", "pencil"])
  }
}
```

argument에 `Input` 타입을 넣으려면 다음과 같이 합니다.

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

- `rootType`: 스키마의 루트 쿼리의 타입
- `models`: 루트 타입을 제외한 나머지 타입들