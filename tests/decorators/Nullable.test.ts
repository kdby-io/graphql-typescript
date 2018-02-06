import { Nullable } from '../../src'
import { getFields } from '../../src/services'

describe('@Nullable', () => {
  it('sets nullable a field', () => {
    class A { @Nullable a: any } 
 
    const nullable = getFields(A.prototype)['a'].nullable
    expect(nullable).toBeTruthy()
  })
})
