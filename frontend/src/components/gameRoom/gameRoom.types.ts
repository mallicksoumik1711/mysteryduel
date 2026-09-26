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

export const MOCK_QUESTIONS: Question[] = [
  { id: 'q1', category: 'Hair', text: 'Does the character have dark hair?' },
  { id: 'q2', category: 'Hair', text: 'Is the character blond or light-haired?' },
  { id: 'q3', category: 'Accessories', text: 'Is the character wearing glasses or goggles?' },
  { id: 'q4', category: 'Accessories', text: 'Is the character wearing a hat or headwear?' },
  { id: 'q5', category: 'Facial Features', text: 'Does the character have facial hair?' },
  { id: 'q6', category: 'Expression', text: 'Is the character smiling or laughing?' },
  { id: 'q7', category: 'Attire', text: 'Is the character wearing dark clothing?' },
  { id: 'q8', category: 'Gender', text: 'Is the character female?' },
];
