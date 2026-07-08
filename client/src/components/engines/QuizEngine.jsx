import React, { useState } from 'react';

/**
 * Generic quiz engine. Renders ANY quiz activity from its content_json --
 * no per-question code. Content shape (see server/db/seed.js):
 *   { question, options: string[], answerIndex: number, explanation?: string }
 *
 * Props:
 *   content   - the parsed content object above
 *   onComplete(result) - called once with { correct: boolean, score: 0|1, timeTakenSeconds }
 *                        so the parent can POST /api/activities/:id/attempt
 */
export default function QuizEngine({ content, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(() => Date.now());

  const isCorrect = selected === content.answerIndex;

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
  }

  function handleContinue() {
    onComplete({
      correct: isCorrect,
      score: isCorrect ? 1 : 0,
      timeTakenSeconds: Math.round((Date.now() - startTime) / 1000)
    });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-6 font-body">
      <h2 className="font-display font-bold text-xl text-ink mb-5">{content.question}</h2>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label={content.question}>
        {content.options.map((opt, idx) => {
          const isChosen = selected === idx;
          const isAnswer = idx === content.answerIndex;

          let stateClasses = 'border-2 border-gray-200 hover:border-sky';
          if (submitted && isAnswer) stateClasses = 'border-2 border-mint bg-mint/10';
          else if (submitted && isChosen && !isAnswer) stateClasses = 'border-2 border-coral bg-coral/10';
          else if (!submitted && isChosen) stateClasses = 'border-2 border-sky bg-sky/10';

          return (
            <button
              key={idx}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={submitted}
              onClick={() => setSelected(idx)}
              className={`text-left px-4 py-3 rounded-xl2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky ${stateClasses} ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-6 w-full py-3 rounded-xl2 font-display font-bold text-white bg-ink disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check answer
        </button>
      )}

      {submitted && (
        <div className="mt-5">
          <p className={`font-display font-bold ${isCorrect ? 'text-mint' : 'text-coral'}`}>
            {isCorrect ? 'Correct! 🎉' : 'Not quite.'}
          </p>
          {content.explanation && (
            <p className="text-sm text-gray-600 mt-1">{content.explanation}</p>
          )}
          <button
            type="button"
            onClick={handleContinue}
            className="mt-4 w-full py-3 rounded-xl2 font-display font-bold text-white bg-coral"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
