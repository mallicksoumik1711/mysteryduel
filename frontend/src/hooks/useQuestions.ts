import { useEffect, useState } from 'react';
import { getAllQuestions } from '../services/questionService';
import type { Question } from '../components/gameRoom/InterrogationPanel';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAllQuestions()
      .then((data) => {
        if (!cancelled) setQuestions(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setQuestionsError(
            err instanceof Error ? err.message : 'Failed to load questions',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingQuestions(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, loadingQuestions, questionsError };
}

