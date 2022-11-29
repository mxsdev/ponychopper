export const PitchKeys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'] as const

export function genKey(key: number, scale: string): number[] {
    if(!isFinite(key)) return []

    const mapper = (a: number) => ((a + key - 1) % 12) + 1

    switch(scale) {
        case 'maj':
            return ([ 0, 2, 4, 5, 7, 9, 11 ]).map(mapper)
        case 'min':
            return ([ 0, 2, 3, 5, 7, 8, 10 ]).map(mapper)
    }

    return []
}

export const PITCH_TO_NUMBER: Record<string, number> = {
    'cb': 12,
    'c': 1,
    'c#': 2,
    'db': 2,
    'd': 3,
    'd#': 4,
    'eb': 4,
    'e': 5,
    'e#': 6,
    'fb': 5,
    'f': 6,
    'f#': 7,
    'gb': 7,
    'g': 8,
    'g#': 9,
    'ab': 9,
    'a': 10,
    'a#': 11,
    'bb': 11,
    'b': 12,
    'b#': 1
}

export const NUMBER_TO_PITCH: Record<number, string> = {
    1: 'c',
    2: 'c#',
    3: 'd',
    4: 'd#',
    5: 'e',
    6: 'f',
    7: 'f#',
    8: 'g',
    9: 'g#',
    10: 'a',
    11: 'a#',
    12: 'b'
}