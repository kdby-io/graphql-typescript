import { Type, ID, Field, Nullable } from '../../src'
import { getTypeMetadata } from '../../src/services'

describe('@Nullable', () => {
  it('sets nullable a property', () => {
    @Type
    class A {
      @Nullable
      @Field(() => ID)
      a: any
    } 
 
    const nullable = getTypeMetadata(A.prototype).fieldMetadataMap['a'].nullable
    expect(nullable).toBeTruthy()
  })
})
