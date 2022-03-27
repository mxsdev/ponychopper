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
const wavesurfer_js_1 = __importDefault(require("wavesurfer.js"));
const app_colors_js_1 = require("app_colors.js");
const Loader_1 = __importDefault(require("component/Loader"));
const config_1 = __importDefault(require("config"));
exports.default = (({ ws, setWS, chopLoading, setChopLoading, currChopID }) => {
    const [showChopLoading, setShowChopLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!chopLoading) {
            setShowChopLoading(false);
        }
        else {
            let timeout = setTimeout(() => setShowChopLoading(true), 300);
            return () => clearTimeout(timeout);
        }
    }, [chopLoading]);
    const divRender = (0, react_1.useCallback)((node) => {
        // file:///I:/MLP/Snippets/pp/pp_but.wav
        const waveshaper = wavesurfer_js_1.default.create({
            container: `#${node.id}`,
            barWidth: 4,
            cursorWidth: 1,
            backend: 'WebAudio',
            barHeight: 3,
            height: 150,
            progressColor: app_colors_js_1.app_colors.acc['2'],
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
        });
        setWS(waveshaper);
        waveshaper.on('ready', function () {
            setChopLoading(false);
            waveshaper.play();
        });
        // @ts-ignore
        // window.electron.getChopDataBlob({episode: '0', chop_filename: 'pp_alittle.wav'}).then(data => {
        //     waveshaper.loadBlob(data)
        // })
        // waveshaper.load('https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_1MG.wav')
    }, []);
    const onDragStart = (event) => {
        event.preventDefault();
        if (config_1.default.desktop && !showChopLoading && currChopID) {
            // @ts-ignore
            window.electron.startDrag(currChopID);
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { id: "waveform", ref: divRender, className: `w-[250px] h-[150px] bg-black py-1 px-5 bg-opacity-10 rounded-md flex flex-col align-center justify-center ${showChopLoading ? 'loading' : ''}`, draggable: true, onDragStart: onDragStart }, showChopLoading ? react_1.default.createElement(Loader_1.default, null) : react_1.default.createElement(react_1.default.Fragment, null))));
});
//# sourceMappingURL=WaveForm.js.map