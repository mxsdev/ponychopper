"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const helpers_1 = require("helpers");
const config_1 = __importDefault(require("config"));
exports.default = ((props) => {
    const [pinned, setPinned] = (0, helpers_1.useLocalStorage)('pinned', true);
    if (!config_1.default.desktop)
        return react_1.default.createElement(react_1.default.Fragment, null);
    (0, react_1.useEffect)(() => {
        // @ts-ignore
        if (!window.electron)
            return;
        // @ts-ignore
        window.electron.setPinned(pinned);
    }, [pinned]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Icon, { pinned: pinned, onClick: () => setPinned(!pinned) })));
});
const Icon = ({ pinned, onClick }) => {
    const cl = "hover:cursor-pointer";
    const size = "2rem";
    const click = () => onClick === null || onClick === void 0 ? void 0 : onClick();
    return pinned ?
        react_1.default.createElement("svg", { onClick: click, className: cl, xmlns: "http://www.w3.org/2000/svg", enableBackground: "new 0 0 24 24", height: size, viewBox: "0 0 24 24", width: size, fill: "#000000" },
            react_1.default.createElement("g", null,
                react_1.default.createElement("rect", { fill: "none", height: "24", width: "24" })),
            react_1.default.createElement("g", null,
                react_1.default.createElement("path", { d: "M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z", fillRule: "evenodd" }))) :
        (react_1.default.createElement("svg", { onClick: click, className: cl, xmlns: "http://www.w3.org/2000/svg", enableBackground: "new 0 0 24 24", height: size, viewBox: "0 0 24 24", width: size, fill: "#000000" },
            react_1.default.createElement("g", null,
                react_1.default.createElement("rect", { fill: "none", height: "24", width: "24" })),
            react_1.default.createElement("g", null,
                react_1.default.createElement("path", { d: "M14,4v5c0,1.12,0.37,2.16,1,3H9c0.65-0.86,1-1.9,1-3V4H14 M17,2H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1c0,0,0,0,0,0l1,0v5 c0,1.66-1.34,3-3,3v2h5.97v7l1,1l1-1v-7H19v-2c0,0,0,0,0,0c-1.66,0-3-1.34-3-3V4l1,0c0,0,0,0,0,0c0.55,0,1-0.45,1-1 C18,2.45,17.55,2,17,2L17,2z" }))));
};
//# sourceMappingURL=PushPin.js.map