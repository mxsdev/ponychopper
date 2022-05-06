import type { ChopSelection } from "chops/chops";

export function compareSelections(sel1: ChopSelection, sel2: ChopSelection): boolean {
    return (
           (sel1.fileIndex === sel2.fileIndex)
        && (sel1.pos.length === sel2.pos.length)
        && (sel1.pos.start === sel2.pos.start)
    )
}