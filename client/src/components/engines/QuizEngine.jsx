import React, { useState, useRef } from 'react';

export default function QuizEngine({ content, onComplete }) {
  const {
    question = '',
    options = [],
    answerIndex,
    correctAnswer,
    explanation = ''
  } = content || {};

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const startTime = useRef(Date.now());

  const expectedAnswer =
    answerIndex !== undefined
      ? options[answerIndex]
      : correctAnswer;

  const isCorrect =
    selected !== null &&
    String(options[selected] || '')
      .trim()
      .toLowerCase() ===
      String(expectedAnswer || '')
        .trim()
        .toLowerCase();

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
  }

  function handleContinue() {
    onComplete({
      correct: isCorrect,
      score: isCorrect ? 1 : 0,
      timeTakenSeconds: Math.floor(
        (Date.now() - startTime.current) / 1000
      )
    });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-6">

      <h2 className="font-display font-bold text-xl text-ink mb-6">
        {question}
      </h2>

      <div className="space-y-3">
        {options.map((option, index) => {

          const selectedOption = selected === index;

          const correctOption =
            String(option).trim().toLowerCase() ===
            String(expectedAnswer || '')
              .trim()
              .toLowerCase();

          let classes =
            'border-2 border-gray-200 hover:border-sky';

          if (!submitted && selectedOption) {
            classes =
              'border-2 border-sky bg-sky bg-opacity-10';
          }

          if (submitted) {
            if (correctOption) {
              classes =
                'border-2 border-mint bg-mint bg-opacity-20';
            } else if (selectedOption) {
              classes =
                'border-2 border-coral bg-coral bg-opacity-20';
            }
          }

          return (
            <button
              key={index}
              onClick={() => setSelected(index)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${classes}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full mt-6 bg-ink text-white font-display font-bold py-3 rounded-lg disabled:opacity-50"
        >
          Check Answer
        </button>
      ) : (
        <>
          <div className="mt-6">

            <div
              className={`font-display text-lg font-bold ${
                isCorrect
                  ? 'text-mint'
                  : 'text-coral'
              }`}
            >
              {isCorrect
                ? '🎉 Correct!'
                : '❌ Incorrect'}
            </div>

            {!isCorrect && (
              <div className="mt-2 text-gray-600">
                Correct Answer:
                <strong> {expectedAnswer}</strong>
              </div>
            )}

            {explanation && (
              <div className="mt-3 text-gray-500">
                {explanation}
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            className="w-full mt-6 bg-coral text-white font-display font-bold py-3 rounded-lg hover:bg-opacity-90"
          >
            Continue
          </button>
        </>
      )}

    </div>
  );
}