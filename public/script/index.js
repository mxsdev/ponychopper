"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_1 = __importDefault(require("react"));
react_dom_1.default.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(main_1.default, null)), document.getElementById('root'));
//# sourceMappingURL=index.js.map