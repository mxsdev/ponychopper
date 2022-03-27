"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterGlobalHotkeys = exports.registerGlobalHotkeys = exports.unregisterHotkeys = exports.registerHotkeys = void 0;
const config_1 = __importDefault(require("config"));
function space(ws) {
    ws === null || ws === void 0 ? void 0 : ws.playPause();
}
function replay(ws) {
    ws === null || ws === void 0 ? void 0 : ws.play(0);
}
const chop = (ws) => {
    return (event) => {
        console.log('onchopkeypressed RECEIVED in hotkeys.ts');
    };
};
let chopListener = null;
let replayListener = null;
const registerHotkeys = ({ ws, chop }) => {
    window.onkeydown = (event) => {
        switch (event.key) {
            case " ":
                space(ws);
                event.preventDefault();
                break;
            case "r":
                // replay(ws)
                window.dispatchEvent(new Event('onreplaykeypressed'));
                event.preventDefault();
                break;
            case "c":
                window.dispatchEvent(new Event('onchopkeypressed'));
                event.preventDefault();
                break;
            case "d":
                if (event.ctrlKey) {
                    console.log("download key");
                    event.preventDefault();
                }
                break;
        }
    };
    chopListener = (event) => chop();
    window.addEventListener('onchopkeypressed', chopListener);
    replayListener = (event) => ws === null || ws === void 0 ? void 0 : ws.play(0);
    window.addEventListener('onreplaykeypressed', replayListener);
};
exports.registerHotkeys = registerHotkeys;
const unregisterHotkeys = () => {
    window.onkeydown = null;
    if (chopListener)
        window.removeEventListener('onchopkeypressed', chopListener);
    if (replayListener)
        window.removeEventListener('onreplaykeypressed', replayListener);
};
exports.unregisterHotkeys = unregisterHotkeys;
const registerGlobalHotkeys = ({ ws, chop }) => {
    if (!config_1.default.desktop)
        return;
    // @ts-ignore
    window.electron.registerGlobalHotkeys();
};
exports.registerGlobalHotkeys = registerGlobalHotkeys;
const unregisterGlobalHotkeys = () => {
    if (!config_1.default.desktop)
        return;
    // @ts-ignore
    window.electron.unregisterGlobalHotkeys();
};
exports.unregisterGlobalHotkeys = unregisterGlobalHotkeys;
//# sourceMappingURL=hotkeys.js.map