import { resolve } from 'path'
import fs from 'fs'
// import type { PathLike } from 'fs'

export async function getFilesRecursively(dir: string): Promise<string[]> {
    const subdirs = await fs.promises.readdir(dir)

    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir)
        return (await fs.promises.stat(res)).isDirectory() ? getFilesRecursively(res) : [res]
    }));

    return files.flat()
}

export async function exists(file: fs.PathLike) {
    return fs.promises.stat(file).then(() => true, () => false);
}

export function ensure_exists(dir: string) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}