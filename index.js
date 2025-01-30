const { app, BrowserWindow, globalShortcut } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
  });

  mainWindow.loadFile('index.html');
  globalShortcut.register('Escape', () => {
    app.quit()
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
