const { contextBridge, ipcRenderer, globalShortcut } = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

// load config
const DEFAULT_CONFIG = { }

let config = DEFAULT_CONFIG

const appDir = path.resolve( os.homedir(), '.horsechopper' );
const confFilePath = path.resolve(appDir, 'config.json')

if(!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir)
}

try {
    fs.statSync(confFilePath)

    const confString = fs.readFileSync(confFilePath, 'utf8')

    config = JSON.parse(confString)
} catch(err) {
    fs.writeFile(confFilePath, JSON.stringify(DEFAULT_CONFIG), (er) => {
        if (er) {
            console.log("Error writing config file!!")
            console.error(er)
            return
        }
    })
}

// local mode
let localMode = false

if(config.localPath) {
  if(!fs.existsSync(path.resolve(config.localPath, "data.json"))) {
    console.warning("data.json not found at supplied localPath")
  } else {
    localMode = true
  }
}

// get chops data
let chopsDataVersion = null

async function getChopsData() {
  if(localMode) {
    const data = await fs.promises.readFile(path.resolve(config.localPath, "data.json"), {encoding: 'utf8'})

    try {
      return JSON.parse(data)
    } catch(err) {
      return null
    }
  }

  return null
}

async function getChopDataBlob(chop_id) {
  if(localMode) {
    const buffer = await fs.promises.readFile(await getChopPath(chop_id))
    return getUsableBlob(buffer)
  }

  return null
}

async function getChopPath(chop_id) {
  const {song, chop_filename} = chop_id

  if(localMode) {
    return path.resolve(config.localPath, song, chop_filename)
  }

  return path.resolve(appDir, chopsDataVersion ?? 'data-version-unknown', song, chop_filename)
}

function getUsableBlob(buffer) {
  return new window.Blob([new Uint8Array(buffer)]);
}

contextBridge.exposeInMainWorld('electron', {
  startDrag: async (chop_id) => {
    ipcRenderer.send('ondragstart', await getChopPath(chop_id))
  },
  setPinned: (pinned) => {
    ipcRenderer.send('onsetpinned', pinned)
  },
  getChopsData: async () => {
    const res = await getChopsData()

    chopsDataVersion = res.version

    return res
  },
  getChopDataBlob,
  registerGlobalHotkeys: (handlers) => {
    ipcRenderer.send('onregisterglobalhotkeys', handlers)
  },
  unregisterGlobalHotkeys: () => {
    ipcRenderer.send('onunregisterglobalhotkeys')
  }
})

ipcRenderer.on('onchopkeypressed', (event) => {
  window.dispatchEvent(new Event('onchopkeypressed'))
})

ipcRenderer.on('onreplaykeypressed', (event) => {
  window.dispatchEvent(new Event('onreplaykeypressed'))
})