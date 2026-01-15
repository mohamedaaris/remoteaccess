// Mock ControlHandler for testing without robotjs
// This allows the app to run without native dependencies

import { MouseMoveMessage, MouseClickMessage, MouseScrollMessage, KeyEventMessage } from './protocol';

export class ControlHandler {
  constructor() {
    console.log('ControlHandler initialized (Mock Mode - robotjs not available)');
    console.log('To enable full control, rebuild robotjs for Electron');
  }

  handleEvent(event: any): void {
    try {
      switch (event.type) {
        case 'mouse_move':
          this.handleMouseMove(event as MouseMoveMessage);
          break;
        case 'mouse_click':
          this.handleMouseClick(event as MouseClickMessage);
          break;
        case 'mouse_scroll':
          this.handleMouseScroll(event as MouseScrollMessage);
          break;
        case 'key_event':
          this.handleKeyEvent(event as KeyEventMessage);
          break;
      }
    } catch (error) {
      console.error('Error handling control event:', error);
    }
  }

  private handleMouseMove(event: MouseMoveMessage): void {
    console.log(`[Mock] Mouse move to (${event.x}, ${event.y})`);
  }

  private handleMouseClick(event: MouseClickMessage): void {
    console.log(`[Mock] Mouse ${event.action} ${event.button} at (${event.x}, ${event.y})`);
  }

  private handleMouseScroll(event: MouseScrollMessage): void {
    console.log(`[Mock] Scroll deltaY: ${event.deltaY}`);
  }

  private handleKeyEvent(event: KeyEventMessage): void {
    console.log(`[Mock] Key ${event.action}: ${event.key}`);
  }
}
