import * as robot from 'robotjs';
import { MouseMoveMessage, MouseClickMessage, MouseScrollMessage, KeyEventMessage } from './protocol';

export class ControlHandler {
  constructor() {
    // Set mouse delay for smoother movement
    robot.setMouseDelay(2);
    robot.setKeyboardDelay(10);
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
    robot.moveMouse(event.x, event.y);
  }

  private handleMouseClick(event: MouseClickMessage): void {
    robot.moveMouse(event.x, event.y);
    
    const button = event.button === 'right' ? 'right' : 'left';
    
    switch (event.action) {
      case 'down':
        robot.mouseToggle('down', button);
        break;
      case 'up':
        robot.mouseToggle('up', button);
        break;
      case 'click':
        robot.mouseClick(button);
        break;
      case 'dblclick':
        robot.mouseClick(button);
        robot.mouseClick(button);
        break;
    }
  }

  private handleMouseScroll(event: MouseScrollMessage): void {
    // robotjs scrollMouse expects (x, y) coordinates for scroll amount
    // Positive values scroll down/right, negative values scroll up/left
    const scrollAmount = Math.floor(event.deltaY / 10);
    robot.scrollMouse(0, scrollAmount);
  }

  private handleKeyEvent(event: KeyEventMessage): void {
    const modifiers: string[] = [];
    
    if (event.modifiers.ctrl) modifiers.push('control');
    if (event.modifiers.alt) modifiers.push('alt');
    if (event.modifiers.shift) modifiers.push('shift');
    if (event.modifiers.meta) modifiers.push('command');

    const key = this.mapKey(event.key);
    
    if (event.action === 'down') {
      robot.keyToggle(key, 'down', modifiers);
    } else if (event.action === 'up') {
      robot.keyToggle(key, 'up', modifiers);
    } else if (event.action === 'press') {
      robot.keyTap(key, modifiers);
    }
  }

  private mapKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      'Enter': 'enter',
      'Backspace': 'backspace',
      'Tab': 'tab',
      'Escape': 'escape',
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'Delete': 'delete',
      'Home': 'home',
      'End': 'end',
      'PageUp': 'pageup',
      'PageDown': 'pagedown',
      ' ': 'space'
    };

    return keyMap[key] || key.toLowerCase();
  }
}
