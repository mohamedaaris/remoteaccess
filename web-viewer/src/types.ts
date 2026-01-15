export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile';
  platform: string;
  online: boolean;
  lastSeen: number;
}
