const { app, BrowserWindow } = require('electron');
const os = require('os');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  try {
    // Dynamically import is-online module
    const isOnline = (await import('is-online')).default;

    // Check if the user has Windows 10 or 11
    if (os.release().startsWith('10.') || os.release().startsWith('11.')) {
      // Check internet connection
      const online = await isOnline();
      if (!online) {
        console.log('No internet connection. Closing Preloader app.');
        app.quit();
      } else {
        console.log('Internet connection detected.');
        // Create the main window
        createWindow();
        // Load the HTProcess HTML file
        mainWindow.loadFile(path.join(__dirname, 'app', 'htgamesapp.html'));
      }
    } else {
      console.log('Unsupported operating system. Closing Preloader app.');
      app.quit();
    }
  } catch (error) {
    console.error('Error:', error);
    app.quit();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
