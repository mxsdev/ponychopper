import { assert } from "chai"
import { regionUnion, regionContains, fragmentsToSpeech, ChopWord, ChopFragment, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer } from "../../app/chops/chops"

type TestFile = { words: ChopWord[], fragments: ChopFragment[] }

const file_lov: TestFile = {
    words: [],
    fragments: [
        { pos: { start: 34, length: 6 }, speech: 'l', syllables: 0, speakers: ['fs'] },
        { pos: { start: 40, length: 12 }, speech: 'o', syllables: 1, speakers: ['fs'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 54, length: 4 }, speech: 'v', syllables: 0, speakers: ['fs'] },
    ]
}

const file_love: TestFile = {
    words: [
        { numFragments: 5, pos: { start: 15, length: 18 }, speech: 'people' },
        { numFragments: 3, pos: { start: 30, length: 64 }, speech: 'love' },
    ],
    fragments: [
        { pos: { start: 34, length: 6 }, speech: 'l', syllables: 0, speakers: ['fs'] },
        { pos: { start: 40, length: 12 }, speech: 'lo', syllables: 1, speakers: ['fs'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 54, length: 4 }, speech: 've', syllables: 0, speakers: ['fs'] },
    ]
}

const file_plelove: TestFile = {
    words: [
        { numFragments: 5, pos: { start: 15, length: 11 }, speech: 'people' },
        { numFragments: 3, pos: { start: 30, length: 64 }, speech: 'love' },
    ],
    fragments: [
        { pos: { start: 25, length: 4 }, speech: 'ple', syllables: 1, speakers: ['ts'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 34, length: 6 }, speech: 'l', syllables: 0, speakers: ['fs'] },
        { pos: { start: 40, length: 12 }, speech: 'lo', syllables: 1, speakers: ['fs'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 54, length: 4 }, speech: 've', syllables: 0, speakers: ['fs'] },
    ]
}

const file_peoplelove: TestFile = {
    words: [
        { numFragments: 3, pos: { start: 15, length: 11 }, speech: 'people' },
        { numFragments: 3, pos: { start: 30, length: 64 }, speech: 'love' },
    ],
    fragments: [
        { pos: { start: 16, length: 1 }, speech: 'p', syllables: 0, speakers: ['ts'] },
        { pos: { start: 17, length: 9 }, speech: 'peo', syllables: 1, speakers: ['ts'], pitches: [ {class: 9, octave: 4} ] },
        { pos: { start: 25, length: 4 }, speech: 'ple', syllables: 1, speakers: ['ts'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 34, length: 6 }, speech: 'l', syllables: 0, speakers: ['fs'] },
        { pos: { start: 40, length: 12 }, speech: 'lo', syllables: 1, speakers: ['fs'], pitches: [ {class: 4, octave: 4} ] },
        { pos: { start: 54, length: 4 }, speech: 've', syllables: 0, speakers: ['fs'] },
    ]
}

describe('chops.ts', () => {
    // describe('waveMetaToChopFile', () => {
    //     it('test', async () => {
    //         const audio_dir = path.join(__dirname, '../../../ponychopper-audio/')
    // '/Users/maxstoumen/Projects/ponychopper-audio'
    //         const manager = await createChopFileManager(audio_dir)

    //         manager.chop()

    //         const buff = await manager.generateFileBuffer()
            
    //         console.log(buff?.length)
    //     })
    // })

    describe('fragment utilities', () => {
        describe('fragments to selection', () => {
            xit('works on testfile lov', () => {
                // assert.deepStrictEqual(
                //     fragmentsToSelection(1, file_lov.fragments, file_lov.words, 1, 2),
                //     { fileIndex: 1, pitches: [ {class: 4, octave: 4} ], pos: { start: 34, length: 24 }, speakers: ['fs'], speech: 'lov', syllables: 1, fragmentIndex: 1, fragmentLength: 2, isWord: false, isWordSet: false, numWords: 0, isPhrase: false, isPhraseSet: false, numPhrases: 0 }
                // )
            })

            xit('works on testfile love', () => {
                // assert.deepStrictEqual(
                //     fragmentsToSelection(1, file_love.fragments, file_love.words, 1, 2),
                //     { fileIndex: 1, pitches: [ {class: 4, octave: 4} ], pos: { start: 34, length: 24 }, speakers: ['fs'], speech: 'love', syllables: 1, fragmentIndex: 1, fragmentLength: 2, isWord: true, isWordSet: true, numWords: 1, isPhrase: false, isPhraseSet: false, numPhrases: 0 }
                // )
            })

            xit('works on testfile plelove', () => {
                // assert.deepStrictEqual(
                //     fragmentsToSelection(1, file_plelove.fragments, file_plelove.words, 1, 2),
                //     { fileIndex: 1, pitches: [ {class: 4, octave: 4} ], pos: { start: 25, length: 33 }, speakers: ['ts', 'fs'], speech: 'plelove', syllables: 2, fragmentIndex: 1, fragmentLength: 2, isWord: false, isWordSet: false, numWords: 1, isPhrase: false, isPhraseSet: false, numPhrases: 0 }
                // )
            })

            xit('works on testfile peoplelove', () => {
                // assert.deepStrictEqual(
                //     fragmentsToSelection(1, file_peoplelove.fragments, file_peoplelove.words, 1, 2),
                //     { fileIndex: 1, pitches: [ {class: 9, octave: 4}, {class: 4, octave: 4} ], pos: { start: 16, length: 42 }, speakers: ['ts', 'fs'], speech: 'peoplelove', syllables: 3, fragmentIndex: 1, fragmentLength: 2, isWord: false, isWordSet: true, numWords: 2, isPhrase: false, isPhraseSet: false, numPhrases: 0 }
                // )
            })
        })

        describe('fragments to speech', () => {
            it('works when no words', () => {
                assert.strictEqual(
                    fragmentsToSpeech(file_lov.fragments, file_lov.words).speech,
                    'lov'
                )
            })

            it('works with single word', () => {
                assert.strictEqual(
                    fragmentsToSpeech(file_love.fragments, file_love.words).speech,
                    'love'
                )
            })

            it('works with 1.5 words', () => {
                assert.strictEqual(
                    fragmentsToSpeech(file_plelove.fragments, file_plelove.words).speech,
                    'plelove'
                )
            })

            it('works with 2 words', () => {
                assert.strictEqual(
                    fragmentsToSpeech(file_peoplelove.fragments, file_peoplelove.words).speech,
                    'peoplelove'
                )
            })
        })
    })

    describe('regionUnion', () => {
        it('is idempotent on a single region', () => {
            assert.deepStrictEqual(
                regionUnion({ start: 4, length: 10 }),
                { start: 4, length: 10 }
            )
        })

        it('works on overlapping regions', () => {
            assert.deepStrictEqual(
                regionUnion({start: 5, length: 10}, {start: 7, length: 10}),
                {start: 5, length: 12}
            )
        })

        it('works for many regions', () => {
            assert.deepStrictEqual(
                regionUnion({start: 2, length: 4}, {start: 6, length: 7}, {start: 15, length: 4}),
                {start: 2, length: 17}
            )
        })
    })

    describe('regionContains', () => {
        describe('on chop index', () => {
            it('behaves for true comparison', () => {
                assert.strictEqual(
                    regionContains({start: 4, length: 9}, 8),
                    true
                )
            })

            it('behaves for false comparison', () => {
                assert.strictEqual(
                    regionContains({ start: 2, length: 3 }, 6),
                    false
                )
            })
        })

        describe('on region index', () => {
            it('behaves for true comparison', () => {
                assert.strictEqual(
                    regionContains({start: 3, length: 3}, {start: 4, length: 10}),
                    true
                )
            })

            it('behaves for false comparison', () => {
                assert.strictEqual(
                    regionContains({start: 4, length: 2}, {start: 7, length: 7}),
                    false
                )
            })
        })
    })
})