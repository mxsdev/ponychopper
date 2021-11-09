/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/electron/desktop.ts":
/*!*********************************!*\
  !*** ./app/electron/desktop.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var electron_1 = __webpack_require__(/*! electron */ "electron");

var path_1 = __importDefault(__webpack_require__(/*! path */ "path")); // create window


var win = null;

function createWindow() {
  win = new electron_1.BrowserWindow({
    width: 450,
    height: 800,
    webPreferences: {
      preload: path_1["default"].join(__dirname, 'preload.js')
    }
  });
  win.loadFile('./public/index.html');
  win.setMenuBarVisibility(false);
}

electron_1.app.whenReady().then(function () {
  createWindow();
});
electron_1.ipcMain.on('ondragstart', function (event, filePath) {
  event.sender.startDrag({
    file: filePath,
    icon: 'I:\\horse.png'
  });
});
electron_1.ipcMain.on('onsetpinned', function (event, pinned) {
  var _a;

  (_a = electron_1.BrowserWindow.getFocusedWindow()) === null || _a === void 0 ? void 0 : _a.setAlwaysOnTop(pinned, 'pop-up-menu');
});
electron_1.ipcMain.on('onregisterglobalhotkeys', function (event) {
  electron_1.globalShortcut.unregisterAll();
  electron_1.globalShortcut.register('CommandOrControl+Shift+C', function () {
    // if(win.isFocused()) return
    win === null || win === void 0 ? void 0 : win.webContents.send('onchopkeypressed');
  });
  electron_1.globalShortcut.register('CommandOrControl+Shift+R', function () {
    win === null || win === void 0 ? void 0 : win.webContents.send('onreplaykeypressed');
  });
});
electron_1.ipcMain.on('onunregisterglobalhotkeys', function (event) {
  electron_1.globalShortcut.unregisterAll();
});

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./app/electron/desktop.ts");
/******/ 	
/******/ })()
;