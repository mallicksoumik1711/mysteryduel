
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
  {
    id: 'q1',
    category: 'Gender',
    text: 'Is the character male?',
  },
  {
    id: 'q2',
    category: 'Gender',
    text: 'Is the character female?',
  },
  {
    id: 'q3',
    category: 'Hair',
    text: 'Does the character have black hair?',
  },
  {
    id: 'q4',
    category: 'Hair',
    text: 'Does the character have brown hair?',
  },
  {
    id: 'q5',
    category: 'Hair',
    text: 'Does the character have blonde hair?',
  },
  {
    id: 'q6',
    category: 'Hair',
    text: 'Does the character have grey hair?',
  },
  {
    id: 'q7',
    category: 'Hair',
    text: 'Does the character have red hair?',
  },
  {
    id: 'q8',
    category: 'Accessories',
    text: 'Is the character wearing glasses?',
  },
  {
    id: 'q9',
    category: 'Facial Features',
    text: 'Does the character have a beard?',
  },
  {
    id: 'q10',
    category: 'Skin',
    text: 'Does the character have light skin?',
  },
  {
    id: 'q11',
    category: 'Skin',
    text: 'Does the character have dark skin?',
  },
];
