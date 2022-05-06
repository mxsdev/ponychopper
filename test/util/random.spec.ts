import { assert } from "chai"
import { randomInteger } from "../../app/util/random"

describe('random utils', () => {
    describe('randomInteger', () => {
        it('is uniformly distributed', () => {
            const results: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }
            let total: number = 10000

            Array(total).fill(undefined).forEach(() => {
                results[randomInteger(4)] += 1
            })

            ;([0, 1, 2, 3]).forEach((i) => {
                assert.approximately(results[i]/total, 1/4, 0.01)
            })
        })

        it('allows multiple arguments', () => {
            const test = Array(10000).fill(undefined).map((_) => randomInteger(4, 9))

            assert.ok(test.every(i => i <= 8 && i >= 4))
            assert.ok(test.some(i => i === 4))
            assert.ok(test.some(i => i === 8))
            assert.ok(test.every(i => i !== 3))
            assert.ok(test.every(i => i !== 9))
        })
    })
})