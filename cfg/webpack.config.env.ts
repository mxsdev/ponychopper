export const IS_DEVELOPER = (process.env.NODE_ENV === 'development')

export const WEBPACK_MODE = (IS_DEVELOPER) ? 'development' : 'production'

export const TS_TRANSPILE_ONLY = IS_DEVELOPER
export const DO_HMR = IS_DEVELOPER