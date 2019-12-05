const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

//Global reference to the Electron window object
let win

//The function to create an Electron window
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
    })

    win.loadURL(require('url').format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    //Open Dev Tools when window opens
    //win.webContents.openDevTools()

    //If multi window is supported, then windows would be stored in an array
    //This is where the window should be deleted from the array
    win.on('closed', () => { win = null })
}

//The constants to find the Python executable or script
const PY_DIST_FOLDER = 'pyadderdist'
const PY_FOLDER = 'pyadder'
const PY_MODULE = 'api'

let pyProcess   //The Python child process
let pyPort      //The port that the process is bound to

//The function to verify that the Python executable folder exists
function guessPackaged() {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
    return require('fs').existsSync(fullPath)
}

//The function to get the Python script path based on if executable folder was found
function getScriptPath() {
    //If executable folder was not found, get the path to the Python script
    if (!guessPackaged()) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py")
    }
    if (process.platform == 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe")
    }
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE)
}

//The function to select a port
function selectPort() {
    pyPort = 4242
    return pyPort
}

//The function to create a Python child process
function createPyProcess() {
    let port = '' + selectPort()
    let script = getScriptPath()

    //Spawn the process
    //Run the executable
    if (guessPackaged()) {
        pyProcess = require('child_process').execFile(script, [port])
    }
    //Spawn the script
    else {
        pyProcess = require('child_process').spawn('python', [script, port])
    }

    if (pyProcess != null) {
        //Print any outputs from the Python process to the console
        pyProcess.stdout.on('data', function (data) {
            console.log(data.toString('utf8'));
        })
    }
}

//The function to kill the Python child process
function exitPyProcess() {
    pyProcess.kill()
    pyProcess = null
    pyPort = null
}

//When Electron is ready to create browser windows.
//Some APIs can only be used after this event.
app.on('ready', createPyProcess)
app.on('ready', createWindow)

//When Electron is about to quit, kill the Python child process
app.on('will-quit', exitPyProcess)

//When all windows of the app are closed
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})