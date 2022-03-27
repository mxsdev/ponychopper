"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const config_1 = __importDefault(require("config"));
const PushPin_1 = __importDefault(require("component/PushPin"));
const Global_1 = __importDefault(require("component/Global"));
exports.default = ((props) => {
    if (!config_1.default.desktop)
        return react_1.default.createElement(react_1.default.Fragment, null);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "fixed left-0 top-0 desktop-menu-items" },
            react_1.default.createElement(PushPin_1.default, null),
            react_1.default.createElement(Global_1.default, { globalMode: props.globalMode, setGlobalMode: props.setGlobalMode }))));
});
//# sourceMappingURL=DesktopMenuItems.js.map