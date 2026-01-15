// Browser-compatible event emitter
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args));
    }
  }

  removeAllListeners() {
    this.events = {};
  }
}

export class SignalingClient extends SimpleEventEmitter {
  private ws: WebSocket | null = null;
  private deviceId: string | null = null;
  private reconnectTimer: number | null = null;

  constructor(private serverUrl: string) {
    super();
  }

  connect(deviceInfo: any): void {
    this.ws = new WebSocket(this.serverUrl);

    this.ws.onopen = () => {
      console.log('Connected to signaling server');
      this.register(deviceInfo);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('Disconnected from signaling server');
      this.emit('disconnected');
      this.scheduleReconnect(deviceInfo);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
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

  private register(deviceInfo: any): void {
    this.send({
      type: 'register_device',
      timestamp: Date.now(),
      device: deviceInfo
    });
  }

  private handleMessage(message: any): void {
    console.log('Received message:', message.type, message);
    switch (message.type) {
      case 'device_registered':
        this.deviceId = message.deviceId;
        console.log('Device registered with ID:', this.deviceId);
        this.emit('device-registered', this.deviceId);
        break;
      
      case 'device_list':
        console.log('Device list received:', message.devices);
        this.emit('device-list', message.devices);
        break;
      
      case 'session_started':
        this.emit('session-started', message.sessionId);
        break;
      
      case 'end_session':
        this.emit('session-ended', message.sessionId);
        break;
      
      case 'offer':
        this.emit('offer', {
          sessionId: message.sessionId,
          sdp: message.sdp
        });
        break;
      
      case 'answer':
        this.emit('answer', {
          sessionId: message.sessionId,
          sdp: message.sdp
        });
        break;
      
      case 'ice_candidate':
        this.emit('ice-candidate', {
          sessionId: message.sessionId,
          candidate: message.candidate
        });
        break;
      
      case 'error':
        this.emit('error', {
          code: message.code,
          message: message.message
        });
        break;
      
      case 'ping':
        this.send({
          type: 'pong',
          timestamp: Date.now()
        });
        break;
    }
  }

  requestSession(targetDeviceId: string, password?: string): void {
    this.send({
      type: 'request_session',
      timestamp: Date.now(),
      targetDeviceId,
      password
    });
  }

  endSession(sessionId: string): void {
    this.send({
      type: 'end_session',
      timestamp: Date.now(),
      sessionId
    });
  }

  sendAnswer(sessionId: string, sdp: string): void {
    this.send({
      type: 'answer',
      timestamp: Date.now(),
      sessionId,
      sdp
    });
  }

  sendIceCandidate(sessionId: string, candidate: RTCIceCandidateInit): void {
    this.send({
      type: 'ice_candidate',
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

  private scheduleReconnect(deviceInfo: any): void {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = window.setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.reconnectTimer = null;
      this.connect(deviceInfo);
    }, 5000);
  }
}
