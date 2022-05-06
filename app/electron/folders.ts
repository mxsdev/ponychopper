import path from 'path'

export function genDefaultSrcDir(root: string) {
    return path.join(root, 'Source Audio')
}

export function genDefaultChopDir(root: string) {
    return path.join(root, 'Chops')
}