import React, { useState } from 'react';

/**
 * Generic match-the-following engine. Content shape:
 *   { instruction, pairs: [{ left, right }] }
 * Click one left item then one right item; matched pairs lock in green, wrong picks flash red.
 */
export default function MatchEngine({ content, onComplete }) {
  const [rightShuffled] = useState(() => shuffle(content.pairs.map(p => p.right)));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState({});      // left -> right
  const [wrongFlash, setWrongFlash] = useState(null);
  const [startTime] = useState(() => Date.now());

  const allMatched = Object.keys(matched).length === content.pairs.length;

  function pickRight(right) {
    if (!selectedLeft) return;
    const correctRight = content.pairs.find(p => p.left === selectedLeft)?.right;
    if (right === correctRight) {
      setMatched(prev => ({ ...prev, [selectedLeft]: right }));
      setSelectedLeft(null);
    } else {
      setWrongFlash(right);
      setTimeout(() => setWrongFlash(null), 500);
    }
  }

  function handleContinue() {
    onComplete({
      correct: true,
      score: 1,
      timeTakenSeconds: Math.round((Date.now() - startTime) / 1000)
    });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-6 font-body">
      <p className="font-display font-bold text-lg text-ink mb-5">{content.instruction}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          {content.pairs.map(p => (
            <button
              key={p.left}
              disabled={!!matched[p.left]}
              onClick={() => setSelectedLeft(p.left)}
              className={`px-3 py-3 rounded-xl2 font-medium border-2 text-left
                ${matched[p.left] ? 'border-mint bg-mint/10 text-gray-400' : selectedLeft === p.left ? 'border-sky bg-sky/10' : 'border-gray-200 hover:border-sky'}`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rightShuffled.map(r => {
            const isMatchedRight = Object.values(matched).includes(r);
            return (
              <button
                key={r}
                disabled={isMatchedRight}
                onClick={() => pickRight(r)}
                className={`px-3 py-3 rounded-xl2 font-medium border-2 text-left
                  ${isMatchedRight ? 'border-mint bg-mint/10 text-gray-400' : wrongFlash === r ? 'border-coral bg-coral/10' : 'border-gray-200 hover:border-sky'}`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <button
          onClick={handleContinue}
          className="mt-6 w-full py-3 rounded-xl2 font-display font-bold text-white bg-coral"
        >
          Continue
        </button>
      )}
    </div>
  );
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
