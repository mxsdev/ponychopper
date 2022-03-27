"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
exports.default = ((props) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("button", { onClick: props.onClick, className: "p-3 bg-acc-1 hover:bg-acc-3 transition-colors duration-75 rounded-md block border-b-2 border-acc-2" }, props.children)));
});
//# sourceMappingURL=Button.js.map