import path from "path"

function getStaticAsset(fileName: string) {
    return path.join(__dirname, "static", fileName)
}

export const ICON_HORSE = {
    64: getStaticAsset("horse_64.png"),
    icns: getStaticAsset("horse.icns"),
    ico: getStaticAsset("horse.ico"),
}