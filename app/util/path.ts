import path from 'path'

export const fileBaseNameNoExt = (p: string) => path.parse(path.basename(p)).name