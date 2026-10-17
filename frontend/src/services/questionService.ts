const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export interface Question {
  id: string;
  text: string;
  attribute_key: string;
}

export async function getAllQuestions(): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions/`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch questions: HTTP ${response.status}`
    );
  }

  return response.json() as Promise<Question[]>;
}