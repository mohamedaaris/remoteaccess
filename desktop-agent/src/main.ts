import { app, BrowserWindow, ipcMain, desktopCapturer, screen, dialog } from 'electron';
import * as path from 'path';
import { SignalingClient } from './SignalingClient';

// Try to load robotjs, fall back to mock if it fails
let ControlHandler: any;
try {
  ControlHandler = require('./ControlHandler').ControlHandler;
  console.log('✓ robotjs loaded successfully');
} catch (error) {
  console.warn('⚠ robotjs not available, using mock handler');
  console.warn('To enable full control, see ROBOTJS_FIX.md');
  ControlHandler = require('./ControlHandlerMock').ControlHandler;
}

let mainWindow: BrowserWindow | null = null;
let signalingClient: SignalingClient | null = null;
let controlHandler: any | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Allow WebRTC in renderer
    },
    title: 'FlowLink Agent'
  });

  // Load the HTML file - adjust path based on whether running from dist or src
  const htmlPath = app.isPackaged 
    ? path.join(__dirname, '../ui/index.html')
    : path.join(__dirname, '../ui/index.html');
  
  mainWindow.loadFile(htmlPath);

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  controlHandler = new ControlHandler();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('connect-server', async (event, serverUrl: string) => {
  try {
    const deviceName = require('os').hostname();
    const platform = process.platform;
    
    signalingClient = new SignalingClient(serverUrl, {
      name: deviceName,
      type: 'desktop',
      platform
    });

    signalingClient.on('device-registered', (deviceId) => {
      mainWindow?.webContents.send('device-registered', deviceId);
    });

    signalingClient.on('device-list', (devices) => {
      mainWindow?.webContents.send('device-list', devices);
    });

    signalingClient.on('session-request', async (data) => {
      const result = await dialog.showMessageBox(mainWindow!, {
        type: 'question',
        buttons: ['Accept', 'Reject'],
        title: 'Remote Access Request',
        message: `${data.fromDevice.name} wants to access your device`,
        detail: `Device: ${data.fromDevice.name}\nType: ${data.fromDevice.type}\nPlatform: ${data.fromDevice.platform}`
      });

      if (result.response === 0) {
        signalingClient?.acceptSession(data.sessionId);
      } else {
        signalingClient?.rejectSession(data.sessionId, 'User rejected');
      }
    });

    signalingClient.on('session-started', async (sessionId) => {
      mainWindow?.webContents.send('session-started', sessionId);
      // WebRTC setup now handled in renderer process
      setupSignalingForSession(sessionId);
    });

    signalingClient.on('session-ended', (sessionId) => {
      mainWindow?.webContents.send('session-ended', sessionId);
    });

    signalingClient.on('control-event', (event) => {
      controlHandler?.handleEvent(event);
    });

    await signalingClient.connect();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('disconnect-server', async () => {
  signalingClient?.disconnect();
  signalingClient = null;
  return { success: true };
});

ipcMain.handle('request-session', async (event, targetDeviceId: string) => {
  if (!signalingClient) {
    return { success: false, error: 'Not connected' };
  }
  
  try {
    await signalingClient.requestSession(targetDeviceId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('end-session', async (event, sessionId: string) => {
  signalingClient?.endSession(sessionId);
  return { success: true };
});

ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 150, height: 150 }
  });
  
  return sources.map(source => ({
    id: source.id,
    name: source.name,
    thumbnail: source.thumbnail.toDataURL()
  }));
});

function setupSignalingForSession(sessionId: string): void {
  if (!signalingClient) return;

  console.log('Setting up signaling for session:', sessionId);

  // Forward answer to renderer
  signalingClient.on('answer', (data: any) => {
    if (data.sessionId === sessionId) {
      console.log('Forwarding answer to renderer');
      mainWindow?.webContents.send('peer-answer', data);
    }
  });

  // Forward ICE candidates to renderer
  signalingClient.on('ice-candidate', (data: any) => {
    if (data.sessionId === sessionId) {
      console.log('Forwarding ICE candidate to renderer');
      mainWindow?.webContents.send('peer-ice-candidate', data);
    }
  });
}

// Handle peer connection events from renderer
ipcMain.on('peer-offer', (event, data) => {
  console.log('Sending offer to signaling server');
  signalingClient?.sendOffer(data.sessionId, data.sdp);
});

ipcMain.on('peer-ice-candidate', (event, data) => {
  console.log('Sending ICE candidate to signaling server');
  signalingClient?.sendIceCandidate(data.sessionId, data.candidate);
});

ipcMain.on('peer-control-event', (event, controlEvent) => {
  console.log('Received control event:', controlEvent.type);
  controlHandler?.handleEvent(controlEvent);
});
