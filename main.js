const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1879,
    height: 931,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

createWindow();
// Load the HTProcess HTML file
mainWindow.loadFile(./app/htgamesapp.html);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
