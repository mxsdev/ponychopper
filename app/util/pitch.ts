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