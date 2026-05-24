export interface ESPStatus {
  temperature: number;
  humidity: number;
  variasiMode: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
}

export interface ActivityLogEntry {
  id: string;
  time: Date;
  message: string;
  type: 'info' | 'success' | 'command' | 'error';
}
