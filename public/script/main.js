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
const config_1 = __importDefault(require("config"));
const Button_1 = __importDefault(require("component/Button"));
const WaveForm_1 = __importDefault(require("component/WaveForm"));
const Filter_1 = __importDefault(require("component/Filter"));
const DesktopMenuItems_1 = __importDefault(require("component/DesktopMenuItems"));
const hotkeys_1 = require("hotkeys");
const locale_1 = require("locale");
const helpers_1 = require("helpers");
const controls_1 = __importDefault(require("controls"));
exports.default = ((props) => {
    // wavesurfer instance    
    const [ws, setWS] = (0, react_1.useState)(null);
    // chops data
    const [chopsData, setChopsData] = (0, helpers_1.useLocalStorage)('chopsData', null);
    const [chopsDataLoading, setChopsDataLoading] = (0, react_1.useState)(!!chopsData);
    (0, react_1.useEffect)(() => {
        if (config_1.default.desktop) {
            // @ts-ignore
            window.electron.getChopsData()
                .then((data) => setChopsData(data))
                .finally(() => setChopsDataLoading(false));
        }
    }, []);
    // load chop
    const [currChopID, setCurrChopID] = (0, react_1.useState)(null);
    const [chopLoading, setChopLoading] = (0, react_1.useState)(false);
    const loadChop = (chop_id) => {
        if (!ws)
            return;
        setChopLoading(true);
        if (config_1.default.desktop) {
            // @ts-ignore
            window.electron.getChopDataBlob(chop_id)
                .then((blob) => {
                ws.loadBlob(blob);
                setCurrChopID(chop_id);
            });
            // .finally(() => setChopLoading(false))
        }
        else {
            // TODO: web loading
            // ws.load()
            // setChopLoading(false)
        }
    };
    // chops
    function transformChop(chop_id) {
        var _a, _b;
        const song = chop_id.song;
        const chop_filename = chop_id.chop_filename;
        const name = chop_filename.split('.')[0];
        const args = name.split('_');
        const transformed = {
            song: song, chop_filename,
            character: args[0],
            slug: (_a = args[1]) !== null && _a !== void 0 ? _a : '',
            season: (_b = locale_1.songLocale[song]) === null || _b === void 0 ? void 0 : _b.season
        };
        return transformed;
    }
    function transformChops({ data: chops }) {
        const chop_ids_unflattened = Object.keys(chops).map(key => chops[key]
            .map((chop) => ({ song: key, chop_filename: chop })));
        const chop_ids = chop_ids_unflattened.flat(1);
        return chop_ids.map(cid => transformChop(cid));
    }
    const [filterOpts, setFilterOpts] = (0, react_1.useState)({
        // characters: listCharacters().map(c => c.key),
        //characters: [ 'fs', 'aj', 'm6', 'pp', 'ra', 'rd', 'ts' ],
        characters: ['fs'],
        seasons: (0, locale_1.listSeasons)(),
        songs: (0, locale_1.listSongs)().map(ep => ep.key)
    });
    const updateFilterOpts = (update) => setFilterOpts(Object.assign(Object.assign({}, filterOpts), update));
    function getFilteredTransformedChops(data) {
        return transformChops(data)
            .filter(chop => filterOpts.characters.includes(chop.character));
        // .filter(chop => filterOpts.songs.includes(chop.song))
        // .filter(chop => filterOpts.seasons.includes(chop.season))
    }
    // useEffect(() => {
    //     if(chopsData) {
    //         updateFilterOpts({characters: ['ra']})
    //         console.log(getFilteredTransformedChops(chopsData))
    //     }
    // }, [chopsData])
    const chop = () => {
        if (!chopsData)
            return;
        const chops = getFilteredTransformedChops(chopsData);
        loadChop(chops[Math.floor(Math.random() * chops.length)]);
    };
    // register hotkeys
    (0, react_1.useEffect)(() => {
        (0, hotkeys_1.registerHotkeys)({ ws, chop });
        return hotkeys_1.unregisterHotkeys;
    }, [ws, chopsData]);
    // register global hotkeys
    const [globalMode, setGlobalMode] = (0, helpers_1.useLocalStorage)('globalMode', config_1.default.desktop ? true : false);
    (0, react_1.useEffect)(() => {
        if (config_1.default.desktop) {
            if (globalMode) {
                (0, hotkeys_1.registerGlobalHotkeys)({ ws, chop });
            }
            else {
                (0, hotkeys_1.unregisterGlobalHotkeys)();
            }
            return hotkeys_1.unregisterGlobalHotkeys;
        }
    }, [ws, chopsData, globalMode]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(DesktopMenuItems_1.default, { globalMode: globalMode, setGlobalMode: setGlobalMode }),
        react_1.default.createElement("div", { className: "w-full max-w-[500px] mx-auto p-4 md:mt-32 mt-16" },
            react_1.default.createElement("p", { className: "text-center text-5xl select-none" }, "\uD83D\uDD2A.\uD83D\uDC34"),
            react_1.default.createElement("p", { className: "mt-8 text-center body-text" }, "Because all \uD83D\uDC34\uD83C\uDFB5 is better with some \uD83D\uDD2A"),
            react_1.default.createElement("div", { className: "flex items-center self-center justify-center mt-8" },
                react_1.default.createElement("div", { className: "text-center overflow-hidden flex-col", draggable: true },
                    react_1.default.createElement(WaveForm_1.default, { currChopID: currChopID, ws: ws, setWS: setWS, chopLoading: chopLoading, setChopLoading: setChopLoading })),
                react_1.default.createElement("div", { className: "flex-col ml-12" },
                    react_1.default.createElement(Button_1.default, { onClick: () => chop() },
                        react_1.default.createElement("span", { className: "text-4xl select-none" }, "\uD83D\uDD2A")))),
            react_1.default.createElement("p", { className: "mt-8 text-center body-text" }, (0, controls_1.default)(false)),
            globalMode ? react_1.default.createElement("p", { className: "mt-4 text-center body-text text-sm" },
                "\uD83C\uDF0E: ",
                (0, controls_1.default)(true)) : '',
            !config_1.default.desktop ? react_1.default.createElement("p", { className: "mt-8 text-center body-text text-sm" },
                "Note: The ",
                react_1.default.createElement("a", { href: "http://github.com" }, "desktop version"),
                " allows you to drag the audio file directly into your DAW + other nice features") : '',
            react_1.default.createElement(Filter_1.default, { filterOpts: filterOpts, updateFilterOpts: updateFilterOpts }))));
});
//# sourceMappingURL=main.js.map