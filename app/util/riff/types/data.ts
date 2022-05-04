export type DWORD = number
export type WORD = number

export type FCC = string

export type WaveData = ({ type: 'data', data: Buffer }|{ type: 'slnc', length: number })[]