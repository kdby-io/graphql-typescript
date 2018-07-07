import { B } from './B';
import { makeSchema } from '../src';
import { A, YInput, ZInput } from './A';
import { getTypeMetadata } from '../src/storage';


makeSchema(A, {
  types: [B, YInput, ZInput],
})

console.log(getTypeMetadata(A.prototype).getLiteral())
console.log(getTypeMetadata(B.prototype).getLiteral())
console.log(getTypeMetadata(YInput.prototype).getLiteral())
console.log(getTypeMetadata(ZInput.prototype).getLiteral())