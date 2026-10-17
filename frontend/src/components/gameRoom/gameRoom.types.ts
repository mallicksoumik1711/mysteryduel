
export interface Question {
  id: string;
  category: string;
  text: string;
}

export interface LogEntry {
  id: string;
  sender: 'You' | 'Opponent';
  text: string;
  answer?: 'Yes' | 'No';
  timestamp: string;
}
