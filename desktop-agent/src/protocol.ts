// Shared protocol definitions for FlowLink

export enum MessageType {
  // Session Management
  REGISTER_DEVICE = 'register_device',
  DEVICE_REGISTERED = 'device_registered',
  DEVICE_LIST = 'device_list',
  REQUEST_SESSION = 'request_session',
  SESSION_REQUEST = 'session_request',
  ACCEPT_SESSION = 'accept_session',
  REJECT_SESSION = 'reject_session',
  SESSION_STARTED = 'session_started',
  END_SESSION = 'end_session',
  
  // WebRTC Signaling
  OFFER = 'offer',
  ANSWER = 'answer',
  ICE_CANDIDATE = 'ice_candidate',
  
  // Control Events
  MOUSE_MOVE = 'mouse_move',
  MOUSE_CLICK = 'mouse_click',
  MOUSE_SCROLL = 'mouse_scroll',
  KEY_EVENT = 'key_event',
  TOUCH_EVENT = 'touch_event',
  
  // Status
  ERROR = 'error',
  PING = 'ping',
  PONG = 'pong'
}

export interface PingMessage extends BaseMessage {
  type: MessageType.PING;
}

export interface PongMessage extends BaseMessage {
  type: MessageType.PONG;
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile';
  platform: string;
  online: boolean;
  lastSeen: number;
}

export interface Session {
  id: string;
  hostDeviceId: string;
  clientDeviceId: string;
  status: 'pending' | 'active' | 'ended';
  createdAt: number;
  password?: string;
}

export interface BaseMessage {
  type: MessageType;
  timestamp: number;
}

export interface RegisterDeviceMessage extends BaseMessage {
  type: MessageType.REGISTER_DEVICE;
  device: Omit<Device, 'id' | 'online' | 'lastSeen'>;
}

export interface DeviceRegisteredMessage extends BaseMessage {
  type: MessageType.DEVICE_REGISTERED;
  deviceId: string;
}

export interface DeviceListMessage extends BaseMessage {
  type: MessageType.DEVICE_LIST;
  devices: Device[];
}

export interface RequestSessionMessage extends BaseMessage {
  type: MessageType.REQUEST_SESSION;
  targetDeviceId: string;
  password?: string;
}

export interface SessionRequestMessage extends BaseMessage {
  type: MessageType.SESSION_REQUEST;
  sessionId: string;
  fromDevice: Device;
}

export interface AcceptSessionMessage extends BaseMessage {
  type: MessageType.ACCEPT_SESSION;
  sessionId: string;
}

export interface RejectSessionMessage extends BaseMessage {
  type: MessageType.REJECT_SESSION;
  sessionId: string;
  reason?: string;
}

export interface SessionStartedMessage extends BaseMessage {
  type: MessageType.SESSION_STARTED;
  sessionId: string;
}

export interface EndSessionMessage extends BaseMessage {
  type: MessageType.END_SESSION;
  sessionId: string;
}

export interface OfferMessage extends BaseMessage {
  type: MessageType.OFFER;
  sessionId: string;
  sdp: string;
}

export interface AnswerMessage extends BaseMessage {
  type: MessageType.ANSWER;
  sessionId: string;
  sdp: string;
}

export interface IceCandidateMessage extends BaseMessage {
  type: MessageType.ICE_CANDIDATE;
  sessionId: string;
  candidate: RTCIceCandidateInit;
}

export interface MouseMoveMessage extends BaseMessage {
  type: MessageType.MOUSE_MOVE;
  x: number;
  y: number;
}

export interface MouseClickMessage extends BaseMessage {
  type: MessageType.MOUSE_CLICK;
  button: 'left' | 'right' | 'middle';
  action: 'down' | 'up' | 'click' | 'dblclick';
  x: number;
  y: number;
}

export interface MouseScrollMessage extends BaseMessage {
  type: MessageType.MOUSE_SCROLL;
  deltaX: number;
  deltaY: number;
}

export interface KeyEventMessage extends BaseMessage {
  type: MessageType.KEY_EVENT;
  action: 'down' | 'up' | 'press';
  key: string;
  code: string;
  modifiers: {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
  };
}

export interface TouchEventMessage extends BaseMessage {
  type: MessageType.TOUCH_EVENT;
  action: 'start' | 'move' | 'end' | 'cancel';
  touches: Array<{
    id: number;
    x: number;
    y: number;
  }>;
}

export interface ErrorMessage extends BaseMessage {
  type: MessageType.ERROR;
  code: string;
  message: string;
}

export interface PingMessage extends BaseMessage {
  type: MessageType.PING;
}

export interface PongMessage extends BaseMessage {
  type: MessageType.PONG;
}

export type Message =
  | RegisterDeviceMessage
  | DeviceRegisteredMessage
  | DeviceListMessage
  | RequestSessionMessage
  | SessionRequestMessage
  | AcceptSessionMessage
  | RejectSessionMessage
  | SessionStartedMessage
  | EndSessionMessage
  | OfferMessage
  | AnswerMessage
  | IceCandidateMessage
  | MouseMoveMessage
  | MouseClickMessage
  | MouseScrollMessage
  | KeyEventMessage
  | TouchEventMessage
  | ErrorMessage
  | PingMessage
  | PongMessage;
