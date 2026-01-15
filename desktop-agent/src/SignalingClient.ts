import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { Message, MessageType, Device } from './protocol';

export class SignalingClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private deviceId: string | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(
    private serverUrl: string,
    private deviceInfo: Omit<Device, 'id' | 'online' | 'lastSeen'>
  ) {
    super();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.serverUrl);

      this.ws.on('open', () => {
        console.log('Connected to signaling server');
        this.register();
        resolve();
      });

      this.ws.on('message', (data: Buffer) => {
        try {
          const message: Message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('Disconnected from signaling server');
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private register(): void {
    this.send({
      type: MessageType.REGISTER_DEVICE,
      timestamp: Date.now(),
      device: this.deviceInfo
    });
  }

  private handleMessage(message: Message): void {
    switch (message.type) {
      case MessageType.DEVICE_REGISTERED:
        this.deviceId = (message as any).deviceId;
        this.emit('device-registered', this.deviceId);
        break;
      
      case MessageType.DEVICE_LIST:
        this.emit('device-list', (message as any).devices);
        break;
      
      case MessageType.SESSION_REQUEST:
        this.emit('session-request', {
          sessionId: (message as any).sessionId,
          fromDevice: (message as any).fromDevice
        });
        break;
      
      case MessageType.SESSION_STARTED:
        this.emit('session-started', (message as any).sessionId);
        break;
      
      case MessageType.END_SESSION:
        this.emit('session-ended', (message as any).sessionId);
        break;
      
      case MessageType.OFFER:
        this.emit('offer', {
          sessionId: (message as any).sessionId,
          sdp: (message as any).sdp
        });
        break;
      
      case MessageType.ANSWER:
        this.emit('answer', {
          sessionId: (message as any).sessionId,
          sdp: (message as any).sdp
        });
        break;
      
      case MessageType.ICE_CANDIDATE:
        this.emit('ice-candidate', {
          sessionId: (message as any).sessionId,
          candidate: (message as any).candidate
        });
        break;
      
      case MessageType.ERROR:
        this.emit('error', {
          code: (message as any).code,
          message: (message as any).message
        });
        break;
      
      case MessageType.PING:
        this.send({
          type: MessageType.PONG,
          timestamp: Date.now()
        });
        break;
    }
  }

  requestSession(targetDeviceId: string, password?: string): void {
    this.send({
      type: MessageType.REQUEST_SESSION,
      timestamp: Date.now(),
      targetDeviceId,
      password
    });
  }

  acceptSession(sessionId: string): void {
    this.send({
      type: MessageType.ACCEPT_SESSION,
      timestamp: Date.now(),
      sessionId
    });
  }

  rejectSession(sessionId: string, reason?: string): void {
    this.send({
      type: MessageType.REJECT_SESSION,
      timestamp: Date.now(),
      sessionId,
      reason
    });
  }

  endSession(sessionId: string): void {
    this.send({
      type: MessageType.END_SESSION,
      timestamp: Date.now(),
      sessionId
    });
  }

  sendOffer(sessionId: string, sdp: string): void {
    this.send({
      type: MessageType.OFFER,
      timestamp: Date.now(),
      sessionId,
      sdp
    });
  }

  sendAnswer(sessionId: string, sdp: string): void {
    this.send({
      type: MessageType.ANSWER,
      timestamp: Date.now(),
      sessionId,
      sdp
    });
  }

  sendIceCandidate(sessionId: string, candidate: RTCIceCandidateInit): void {
    this.send({
      type: MessageType.ICE_CANDIDATE,
      timestamp: Date.now(),
      sessionId,
      candidate
    });
  }

  private send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = null;
      this.connect().catch(console.error);
    }, 5000);
  }
}
