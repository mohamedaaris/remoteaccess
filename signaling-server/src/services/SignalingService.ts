import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import {
  Message,
  MessageType,
  Device,
  Session,
  RegisterDeviceMessage,
  RequestSessionMessage,
  AcceptSessionMessage,
  RejectSessionMessage,
  EndSessionMessage,
  OfferMessage,
  AnswerMessage,
  IceCandidateMessage
} from '../../../shared/protocol';

interface ConnectedDevice extends Device {
  ws: WebSocket;
}

export class SignalingService {
  private devices: Map<string, ConnectedDevice> = new Map();
  private sessions: Map<string, Session> = new Map();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(private wss: WebSocketServer) {
    this.setupWebSocketServer();
    this.startPingInterval();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      ws.on('message', (data: Buffer) => {
        try {
          const message: Message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.sendError(ws, 'PARSE_ERROR', 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private handleMessage(ws: WebSocket, message: Message): void {
    console.log('Received message:', message.type);

    switch (message.type) {
      case MessageType.REGISTER_DEVICE:
        this.handleRegisterDevice(ws, message as RegisterDeviceMessage);
        break;
      case MessageType.REQUEST_SESSION:
        this.handleRequestSession(ws, message as RequestSessionMessage);
        break;
      case MessageType.ACCEPT_SESSION:
        this.handleAcceptSession(ws, message as AcceptSessionMessage);
        break;
      case MessageType.REJECT_SESSION:
        this.handleRejectSession(ws, message as RejectSessionMessage);
        break;
      case MessageType.END_SESSION:
        this.handleEndSession(ws, message as EndSessionMessage);
        break;
      case MessageType.OFFER:
        this.handleOffer(ws, message as OfferMessage);
        break;
      case MessageType.ANSWER:
        this.handleAnswer(ws, message as AnswerMessage);
        break;
      case MessageType.ICE_CANDIDATE:
        this.handleIceCandidate(ws, message as IceCandidateMessage);
        break;
      case MessageType.PING:
        this.handlePing(ws);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleRegisterDevice(ws: WebSocket, message: RegisterDeviceMessage): void {
    // Check if this device is already registered (by name and type)
    let existingDevice: ConnectedDevice | undefined;
    for (const [id, device] of this.devices.entries()) {
      if (device.name === message.device.name && 
          device.type === message.device.type) {
        // Found device with same name/type - reuse it
        existingDevice = device;
        existingDevice.id = id;
        break;
      }
    }

    let deviceId: string;
    if (existingDevice) {
      // Reuse existing device ID and update connection
      deviceId = existingDevice.id;
      existingDevice.ws = ws;
      existingDevice.online = true;
      existingDevice.lastSeen = Date.now();
      console.log(`Device reconnected: ${deviceId} (${existingDevice.name})`);
      
      // Update the device in the map
      this.devices.set(deviceId, existingDevice);
    } else {
      // Create new device
      deviceId = uuidv4();
      const device: ConnectedDevice = {
        id: deviceId,
        ...message.device,
        online: true,
        lastSeen: Date.now(),
        ws
      };
      this.devices.set(deviceId, device);
      console.log(`Device registered: ${deviceId} (${device.name})`);
    }

    this.send(ws, {
      type: MessageType.DEVICE_REGISTERED,
      timestamp: Date.now(),
      deviceId
    });

    this.broadcastDeviceList();
  }

  private handleRequestSession(ws: WebSocket, message: RequestSessionMessage): void {
    const clientDevice = this.getDeviceByWebSocket(ws);
    if (!clientDevice) {
      this.sendError(ws, 'NOT_REGISTERED', 'Device not registered');
      return;
    }

    const targetDevice = this.devices.get(message.targetDeviceId);
    if (!targetDevice || !targetDevice.online) {
      this.sendError(ws, 'DEVICE_NOT_FOUND', 'Target device not found or offline');
      return;
    }

    const sessionId = uuidv4();
    const session: Session = {
      id: sessionId,
      hostDeviceId: message.targetDeviceId,
      clientDeviceId: clientDevice.id,
      status: 'pending',
      createdAt: Date.now(),
      password: message.password
    };

    this.sessions.set(sessionId, session);
    console.log(`Session requested: ${sessionId}`);

    // Notify target device
    this.send(targetDevice.ws, {
      type: MessageType.SESSION_REQUEST,
      timestamp: Date.now(),
      sessionId,
      fromDevice: {
        id: clientDevice.id,
        name: clientDevice.name,
        type: clientDevice.type,
        platform: clientDevice.platform,
        online: clientDevice.online,
        lastSeen: clientDevice.lastSeen
      }
    });
  }

  private handleAcceptSession(ws: WebSocket, message: AcceptSessionMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) {
      this.sendError(ws, 'SESSION_NOT_FOUND', 'Session not found');
      return;
    }

    const hostDevice = this.getDeviceByWebSocket(ws);
    if (!hostDevice || hostDevice.id !== session.hostDeviceId) {
      this.sendError(ws, 'UNAUTHORIZED', 'Not authorized to accept this session');
      return;
    }

    session.status = 'active';
    console.log(`Session accepted: ${session.id}`);

    const clientDevice = this.devices.get(session.clientDeviceId);
    if (clientDevice) {
      this.send(clientDevice.ws, {
        type: MessageType.SESSION_STARTED,
        timestamp: Date.now(),
        sessionId: session.id
      });
    }

    this.send(ws, {
      type: MessageType.SESSION_STARTED,
      timestamp: Date.now(),
      sessionId: session.id
    });
  }

  private handleRejectSession(ws: WebSocket, message: RejectSessionMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) return;

    session.status = 'ended';
    console.log(`Session rejected: ${session.id}`);

    const clientDevice = this.devices.get(session.clientDeviceId);
    if (clientDevice) {
      this.send(clientDevice.ws, {
        type: MessageType.REJECT_SESSION,
        timestamp: Date.now(),
        sessionId: session.id,
        reason: message.reason
      });
    }

    this.sessions.delete(message.sessionId);
  }

  private handleEndSession(ws: WebSocket, message: EndSessionMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) return;

    session.status = 'ended';
    console.log(`Session ended: ${session.id}`);

    const hostDevice = this.devices.get(session.hostDeviceId);
    const clientDevice = this.devices.get(session.clientDeviceId);

    [hostDevice, clientDevice].forEach(device => {
      if (device && device.ws !== ws) {
        this.send(device.ws, {
          type: MessageType.END_SESSION,
          timestamp: Date.now(),
          sessionId: session.id
        });
      }
    });

    this.sessions.delete(message.sessionId);
  }

  private handleOffer(ws: WebSocket, message: OfferMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) {
      console.error('Session not found for offer:', message.sessionId);
      return;
    }

    // Offer comes from host (desktop agent), send to client (web-viewer)
    const targetDevice = this.devices.get(session.clientDeviceId);
    if (targetDevice) {
      console.log(`Routing offer from host to client: ${session.clientDeviceId}`);
      this.send(targetDevice.ws, message);
    } else {
      console.error('Client device not found:', session.clientDeviceId);
    }
  }

  private handleAnswer(ws: WebSocket, message: AnswerMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) {
      console.error('Session not found for answer:', message.sessionId);
      return;
    }

    // Answer comes from client (web-viewer), send to host (desktop agent)
    const targetDevice = this.devices.get(session.hostDeviceId);
    if (targetDevice) {
      console.log(`Routing answer from client to host: ${session.hostDeviceId}`);
      this.send(targetDevice.ws, message);
    } else {
      console.error('Host device not found:', session.hostDeviceId);
    }
  }

  private handleIceCandidate(ws: WebSocket, message: IceCandidateMessage): void {
    const session = this.sessions.get(message.sessionId);
    if (!session) {
      console.error('Session not found for ICE candidate:', message.sessionId);
      return;
    }

    const device = this.getDeviceByWebSocket(ws);
    if (!device) {
      console.error('Device not found for ICE candidate');
      return;
    }

    const targetDeviceId = device.id === session.hostDeviceId
      ? session.clientDeviceId
      : session.hostDeviceId;

    const targetDevice = this.devices.get(targetDeviceId);
    if (targetDevice) {
      console.log(`Routing ICE candidate from ${device.id.substring(0, 8)} to ${targetDeviceId.substring(0, 8)}`);
      this.send(targetDevice.ws, message);
    } else {
      console.error('Target device not found for ICE candidate:', targetDeviceId);
    }
  }

  private handlePing(ws: WebSocket): void {
    this.send(ws, {
      type: MessageType.PONG,
      timestamp: Date.now()
    });
  }

  private handleDisconnect(ws: WebSocket): void {
    const device = this.getDeviceByWebSocket(ws);
    if (device) {
      console.log(`Device disconnected: ${device.id}`);
      
      // Mark device as offline but don't delete immediately
      device.online = false;
      device.lastSeen = Date.now();
      
      // Give 10 seconds grace period before ending sessions
      // This handles quick reconnects (page refresh, network blip)
      setTimeout(() => {
        const currentDevice = this.devices.get(device.id);
        if (currentDevice && !currentDevice.online) {
          console.log(`Device still offline after grace period, cleaning up: ${device.id}`);
          this.devices.delete(device.id);
          
          // End all sessions involving this device
          this.sessions.forEach((session, sessionId) => {
            if (session.hostDeviceId === device.id || session.clientDeviceId === device.id) {
              console.log(`Ending session due to device timeout: ${sessionId}`);
              const otherDeviceId = session.hostDeviceId === device.id 
                ? session.clientDeviceId 
                : session.hostDeviceId;
              const otherDevice = this.devices.get(otherDeviceId);
              
              if (otherDevice) {
                this.send(otherDevice.ws, {
                  type: MessageType.END_SESSION,
                  timestamp: Date.now(),
                  sessionId
                });
              }
              
              this.sessions.delete(sessionId);
            }
          });
          
          this.broadcastDeviceList();
        }
      }, 10000); // 10 second grace period
      
      this.broadcastDeviceList();
    }
  }

  private broadcastDeviceList(): void {
    const deviceList = Array.from(this.devices.values()).map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      platform: d.platform,
      online: d.online,
      lastSeen: d.lastSeen
    }));

    const message = {
      type: MessageType.DEVICE_LIST,
      timestamp: Date.now(),
      devices: deviceList
    };

    this.devices.forEach(device => {
      this.send(device.ws, message);
    });
  }

  private getDeviceByWebSocket(ws: WebSocket): ConnectedDevice | undefined {
    return Array.from(this.devices.values()).find(d => d.ws === ws);
  }

  private send(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, code: string, message: string): void {
    this.send(ws, {
      type: MessageType.ERROR,
      timestamp: Date.now(),
      code,
      message
    });
  }

  private startPingInterval(): void {
    const interval = parseInt(process.env.PING_INTERVAL || '30000');
    this.pingInterval = setInterval(() => {
      // Clean up disconnected devices
      const disconnectedDevices: string[] = [];
      this.devices.forEach((device, deviceId) => {
        if (device.ws.readyState !== WebSocket.OPEN) {
          disconnectedDevices.push(deviceId);
        }
      });
      
      if (disconnectedDevices.length > 0) {
        disconnectedDevices.forEach(deviceId => {
          const device = this.devices.get(deviceId);
          if (device) {
            console.log(`Cleaning up disconnected device: ${deviceId} (${device.name})`);
            this.devices.delete(deviceId);
          }
        });
        this.broadcastDeviceList();
      }

      // Send ping to connected devices
      this.devices.forEach(device => {
        if (device.ws.readyState === WebSocket.OPEN) {
          this.send(device.ws, {
            type: MessageType.PING,
            timestamp: Date.now()
          });
        }
      });
    }, interval);
  }
}
