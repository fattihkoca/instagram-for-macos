// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, shell} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 414,
        height: 766,
        resizable: false,
        fullscreenable: false,
        minimizable: true,
        closable: true,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        transparent: true,
        titleBarStyle: 'hiddenInset',
        setWindowButtonVisibility: false,
        backgroundColor: '#FFF',
        //show: false
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

const template = [
    {
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'reload'},
            {role: 'forceReload'},
            {type: 'separator'},
            {role: 'minimize'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {
                label: 'Web Version',
                click() {
                    require('electron').shell.openExternal('https://instagram.com')
                }
            },
            {
                label: 'App Store',
                click() {
                    require('electron').shell.openExternal('https://apps.apple.com/tr/app/instagram/id389801252')
                }
            },
            {
                label: 'Google Play',
                click() {
                    require('electron').shell.openExternal('https://play.google.com/store/apps/details?id=com.instagram.android&hl=tr')
                }
            },
            {type: 'separator'},
            {role: 'quit'}
        ]
    },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// ---------

// Context Menu
const contextMenu = require('electron-context-menu');

app.on('web-contents-created', (e, contents) => {
    if (contents.getType() === 'webview') {
        // open link with external browser in webview
        contents.on('new-window', (e, url) => {
            e.preventDefault();
            const protocol = require('url').parse(url).protocol
            if (protocol === 'http:' || protocol === 'https:') {
                shell.openExternal(url)
            }
        });

        // set context menu in webview
        contextMenu({
            window: contents,
            append: (defaultActions, params, browserWindow) => [
                {role: 'copyLink', visible: params.linkText},
                {role: 'copyImage', visible: params.hasImageContents},
                {type: 'separator'},
                {role: 'reload'},
                {type: 'separator'},
                {role: 'about'},
            ],
            showCopyImage: true,
            showCopyImageAddress: true,
            showSaveImageAs: true,
            showLookUpSelection: true,
        });
    }
});

// -------

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
