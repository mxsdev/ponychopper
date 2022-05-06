import { assert } from 'chai';
import { getContiguousSubarrays } from './../../app/util/arrays';
describe('array utils', () => {
    describe('getContiguousSubarrays', () => {
        it('generates subarray for small case', () => {
            const res = getContiguousSubarrays([1, 2, 3, 4])

            assert.deepStrictEqual(
                res.sort((a, b) => a.length - b.length),
                [ [1], [2], [3], [4], [1, 2], [2, 3], [3, 4], [1, 2, 3], [2, 3, 4], [1, 2, 3, 4] ]
            )
        })
    })
})