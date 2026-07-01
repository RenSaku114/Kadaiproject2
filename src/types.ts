export type GameStage =
  | 'boot'
  | 'desktop'
  | 'phishing_site'
  | 'hacking_sequence'
  | 'crash_screen'
  | 'clear_screen';

export type LoopCount = 1 | 2;

export interface Message {
  id: string;
  sender: 'friend' | 'player' | 'system';
  text: string;
  timestamp: string;
  isUrl?: boolean;
  url?: string;
}

export interface OSWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface GameState {
  loop: LoopCount;
  stage: GameStage;
  glitchLevel: number; // 0 to 100
  activeWindows: string[]; // Window IDs
  messages: Message[];
  chatStep: number;
  hasInputPassword?: boolean;
  isPhoneCalling?: boolean;
  phoneCallStatus?: 'idle' | 'calling' | 'connected' | 'ended';
  isTwoFactorEnabled?: boolean;
  isPhishingReported?: boolean;
  alertCount: number;
  showWebcam?: boolean;
  showRansomware?: boolean;
}
