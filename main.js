const { app, BrowserWindow, dialog, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function checkNetworkConnection() {
  const interfaces = networkInterfaces();
  return Object.keys(interfaces).some(name =>
    interfaces[name].some(iface => !iface.internal && iface.address !== '127.0.0.1')
  );
}

function createWindow(initialHTMLPath, laterHTMLPath) {
  // Check the OS and network connection
  const hasNetworkConnection = checkNetworkConnection();

    dialog.showMessageBox({
      type: 'error',
      title: 'Error',
      message: `App cannot start: ${errorMessage}`,
      buttons: ['OK'],
    }, () => app.quit());

    return;
  }

  const mainWindow = new BrowserWindow({
    width: 1879,
    height: 931,
    icon: path.join(__dirname, 'icon.png'),
    frame: false, // Show window controls (minimize, maximize, close)
    resizable: false,
    skipTaskbar: true,
  });

  mainWindow.loadFile(initialHTMLPath);

  // Remove the default menu bar
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', function () {
    app.quit();
  });

  // Wait for 1 second and then load the HTML file with news and apps
  setTimeout(() => {
    mainWindow.loadFile(laterHTMLPath);
    mainWindow.setResizable(true);
    mainWindow.setFullScreenable(true);
    mainWindow.setSkipTaskbar(false);
    mainWindow.maximize(); // Maximize the window
    mainWindow.setClosable(true); // Enable closing via the top of the window
  }, 1000);
}

app.on('ready', () => {
  try {
    createWindow('index.html', 'htgamesapp.html');
    console.log('App is ready');
  } catch (error) {
    // Handle errors and display a warning popup
    dialog.showMessageBox({
      type: 'error',
      title: 'HTL Stopped Running',
      message: 'An Error Has Occurred, Please Try Again Later.',
      buttons: ['OK'],
    }, () => app.quit());
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow('index.html', 'htgamesapp.html');
});
