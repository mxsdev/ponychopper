"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const react_1 = __importDefault(require("react"));
exports.default = (({ filterOpts, updateFilterOpts }) => {
    const [open, setOpen] = (0, helpers_1.useLocalStorage)('filterOpen', false);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("p", { className: "font-mono mt-4 text-left text-lg font-bold select-none hover:cursor-pointer", onClick: () => setOpen(!open) },
            "Filter ",
            !open ? '▲' : '▼'),
        open ?
            react_1.default.createElement("div", { className: 'filter-container' },
                react_1.default.createElement(FilterRow, null,
                    react_1.default.createElement(FilterCol1, null,
                        react_1.default.createElement("p", { className: "body-text" }, "Test")),
                    react_1.default.createElement(FilterCol2, null,
                        react_1.default.createElement("p", { className: "body-text" }, "Test2"))),
                react_1.default.createElement(FilterRow, null,
                    react_1.default.createElement(FilterCol1, null,
                        react_1.default.createElement("p", { className: "body-text" }, "Test")),
                    react_1.default.createElement(FilterCol2, null,
                        react_1.default.createElement("p", { className: "body-text" }, "Test2"))))
            : ''));
});
const FilterRow = ({ children }) => react_1.default.createElement("div", { className: 'flex' }, children);
const FilterCol1 = ({ children }) => react_1.default.createElement("div", { className: "flex-col w-1/5" }, children);
const FilterCol2 = ({ children }) => react_1.default.createElement("div", { className: "flex-col w-4/5" }, children);
//# sourceMappingURL=Filter.js.map