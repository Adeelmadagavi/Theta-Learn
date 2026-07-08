import React from 'react';

/**
 * TODO -- build this engine following the same contract as QuizEngine.jsx / MatchEngine.jsx:
 *   props: { content, onComplete }
 *   onComplete({ correct, score, timeTakenSeconds })
 * See PROMPT.md at the project root for the exact content_json shape this engine receives
 * and a ready-to-paste prompt for an AI pair-programmer to generate it fast.
 */
export default function SequenceEngine({ content, onComplete }) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-6 font-body text-center">
      <p className="font-display font-bold text-lg mb-2">{content.instruction || content.title}</p>
      <p className="text-gray-500 text-sm mb-6">This engine isn't wired up yet -- see PROMPT.md.</p>
      <button
        onClick={() => onComplete({ correct: true, score: 1, timeTakenSeconds: 0 })}
        className="py-3 px-6 rounded-xl2 font-display font-bold text-white bg-ink"
      >
        Mark as done (placeholder)
      </button>
    </div>
  );
}
