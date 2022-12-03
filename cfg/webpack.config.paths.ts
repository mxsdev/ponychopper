import path from 'path'

const DIR_ROOT = path.join(__dirname, '../')

const DIR_ASSETS = path.join(DIR_ROOT, 'assets')
const DIR_DIST = path.join(DIR_ROOT, 'dist')
const DIR_APP  = path.join(DIR_ROOT, 'app')
const DIR_DOCS = path.join(DIR_APP, 'docs')
const DIR_CSS = path.join(DIR_APP, 'css')
const DIR_DIST_DOCS = path.join(DIR_ROOT, 'gh-pages')

const ICON_NAME     = 'horse.png'
const ICON          = path.join(DIR_ROOT, ICON_NAME)

const DIST_DIR_UI     = 'ui'
const DIST_DIR_CSS    = path.join(DIST_DIR_UI, 'css')
const DIST_DIR_JS     = path.join(DIST_DIR_UI, 'js')
const DIST_DIR_HTML   = DIST_DIR_UI
const DIST_DIR_SCRIPT = 'script'
const DIST_DIR_ICON = ''

const DIST_PUBLIC = path.resolve(DIR_DIST, DIST_DIR_HTML)
const DIST_DIR_DOCS_JS = 'js'
const DIST_DOCS_REACT_MAIN = path.join(DIST_DIR_DOCS_JS, 'bundle.js')
const DIST_DOCS_INDEX_HTML = 'index.html'

const DIST_INDEX_HTML    = path.join(DIST_DIR_HTML, 'index.html')
const DIST_CSS_MAIN      = path.join(DIST_DIR_CSS, 'main.css')
const DIST_REACT_MAIN    = path.join(DIST_DIR_JS, 'bundle.js')
const DIST_PRELOAD       = path.join(DIST_DIR_SCRIPT, 'preload.js')
const DIST_ELECTRON_MAIN = path.join('main.js')
const DIST_ICON          = path.join(DIST_DIR_ICON, ICON_NAME)

const ELECTRON_MAIN = path.join(DIR_APP, 'electron', 'main.ts')
const PRELOAD       = path.join(DIR_APP, 'electron', 'preload.ts')

const REACT_MAIN = path.join(DIR_APP, 'index.tsx')
const CSS_MAIN   = path.join(DIR_CSS, 'main.css')
const HTML_MAIN = path.join(DIR_APP, 'index.html')

const REACT_DOCS = path.join(DIR_DOCS, 'index.tsx')
const CSS_DOCS = CSS_MAIN
const HTML_DOCS = path.join(DIR_DOCS, 'index.html')

export const PROJECT_PATHS = {
    DIR_DIST, DIR_APP, DIR_CSS, DIR_DOCS, DIR_DIST_DOCS, DIR_ASSETS,

    ICON_NAME, ICON,

    DIST_DIR_UI, DIST_DIR_CSS, DIST_DIR_JS, DIST_DIR_HTML, DIST_DIR_SCRIPT, DIST_DIR_ICON,

    DIST_INDEX_HTML, DIST_CSS_MAIN, DIST_REACT_MAIN, DIST_PRELOAD, DIST_ELECTRON_MAIN, DIST_ICON,

    DIST_DOCS_REACT_MAIN, DIST_DOCS_INDEX_HTML,

    ELECTRON_MAIN, PRELOAD,

    REACT_MAIN, CSS_MAIN, HTML_MAIN,
    REACT_DOCS, CSS_DOCS, HTML_DOCS,

    DIST_PUBLIC
}