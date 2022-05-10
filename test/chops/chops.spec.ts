import { assert } from "chai"
import { regionUnion, regionContains, fragmentsToSpeech, ChopWord, ChopFragment, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer, ChopFile } from "../../app/chops/chops"
import fs from 'fs'
import path from 'path'
import { getWaveMeta } from "../../app/util/riff"

// type TestFile = { words: ChopWord[], fragments: ChopFragment[] }

const smw_loc = path.join(__dirname, '../src/So Many Wonders.wav')

let testFiles: ChopFile[] = [ ]

describe('chops.ts', () => {
    before(async () => {
        const smw_buff = fs.readFileSync(smw_loc)

        const smw_meta = await getWaveMeta({
            read: async (buff, offset, length, pos) => {
                const start = (offset ?? 0) + (pos ?? 0)
                const end = start + (length ?? smw_buff.length)

                const read = smw_buff.slice(start, end)
                buff.set(read)
                return { bytesRead: read.length }
            }
        }, smw_buff.length)

        testFiles.push( waveMetaToChopFile(smw_meta, smw_loc) )
    })

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
            const testRegion = (start: number, length: number) => fragmentsToSelection(0, testFiles[0], testFiles[0].chops.slice(start, start + length), testFiles[0].words, start, length)

            it('test', () => {
                const test = testRegion(5, 3)

                assert.deepStrictEqual(
                    test.word,
                    { leftFull: true, rightFull: true, numWords: 1 }
                )

                assert.strictEqual(
                    test.speech,
                    'place'
                )
            })

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

        // describe('fragments to speech', () => {
        //     it('works when no words', () => {
        //         assert.strictEqual(
        //             fragmentsToSpeech(file_lov.fragments, file_lov.words).speech,
        //             'lov'
        //         )
        //     })

        //     it('works with single word', () => {
        //         assert.strictEqual(
        //             fragmentsToSpeech(file_love.fragments, file_love.words).speech,
        //             'love'
        //         )
        //     })

        //     it('works with 1.5 words', () => {
        //         assert.strictEqual(
        //             fragmentsToSpeech(file_plelove.fragments, file_plelove.words).speech,
        //             'plelove'
        //         )
        //     })

        //     it('works with 2 words', () => {
        //         assert.strictEqual(
        //             fragmentsToSpeech(file_peoplelove.fragments, file_peoplelove.words).speech,
        //             'peoplelove'
        //         )
        //     })
        // })
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