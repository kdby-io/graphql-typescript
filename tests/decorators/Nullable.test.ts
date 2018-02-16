import { Nullable } from '../../src'
import { getProperties } from '../../src/services'

describe('@Nullable', () => {
  it('sets nullable a property', () => {
    class A { @Nullable a: any } 
 
    const nullable = getProperties(A.prototype)['a'].nullable
    expect(nullable).toBeTruthy()
  })
})
