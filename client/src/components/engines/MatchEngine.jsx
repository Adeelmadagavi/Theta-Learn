import React, { useState, useRef } from 'react';

export default function MatchEngine({ content, onComplete }) {
  const {
    instruction = '',
    pairs = []
  } = content || {};

  const [rightItems] = useState(() =>
    shuffle(pairs.map(p => p.right))
  );

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrongFlash, setWrongFlash] = useState(null);

  const startTime = useRef(Date.now());

  const allMatched =
    pairs.length > 0 &&
    Object.keys(matched).length === pairs.length;

  function pickLeft(left) {
    if (matched[left]) return;
    setSelectedLeft(left);
  }

  function pickRight(right) {
    if (!selectedLeft) return;

    const pair = pairs.find(
      p =>
        String(p.left).trim().toLowerCase() ===
        String(selectedLeft).trim().toLowerCase()
    );

    if (!pair) return;

    const expected = String(pair.right).trim().toLowerCase();
    const chosen = String(right).trim().toLowerCase();

    if (expected === chosen) {
      setMatched(prev => ({
        ...prev,
        [selectedLeft]: right
      }));

      setSelectedLeft(null);
    } else {
      setWrongFlash(right);

      setTimeout(() => {
        setWrongFlash(null);
      }, 500);
    }
  }

  function handleSubmit() {
    let correctCount = 0;

    pairs.forEach(pair => {
      const placed =
        matched[pair.left] || '';

      if (
        String(placed).trim().toLowerCase() ===
        String(pair.right).trim().toLowerCase()
      ) {
        correctCount++;
      }
    });

    const score =
      pairs.length > 0
        ? correctCount / pairs.length
        : 0;

    onComplete({
      correct: score === 1,
      score,
      timeTakenSeconds: Math.floor(
        (Date.now() - startTime.current) / 1000
      )
    });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl2 shadow-md p-6 font-body">

      <h2 className="font-display font-bold text-xl text-ink mb-6">
        {instruction}
      </h2>

      <div className="grid grid-cols-2 gap-5">

        {/* LEFT */}

        <div className="space-y-3">
          {pairs.map(pair => (
            <button
              key={pair.left}
              disabled={!!matched[pair.left]}
              onClick={() => pickLeft(pair.left)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                ${
                  matched[pair.left]
                    ? 'border-mint bg-mint bg-opacity-20 text-gray-500'
                    : selectedLeft === pair.left
                    ? 'border-sky bg-sky bg-opacity-10'
                    : 'border-gray-200 hover:border-sky'
                }`}
            >
              {pair.left}
            </button>
          ))}
        </div>

        {/* RIGHT */}

        <div className="space-y-3">
          {rightItems.map(right => {
            const used =
              Object.values(matched).includes(right);

            return (
              <button
                key={right}
                disabled={used}
                onClick={() => pickRight(right)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                  ${
                    used
                      ? 'border-mint bg-mint bg-opacity-20 text-gray-500'
                      : wrongFlash === right
                      ? 'border-coral bg-coral bg-opacity-10'
                      : 'border-gray-200 hover:border-sky'
                  }`}
              >
                {right}
              </button>
            );
          })}
        </div>

      </div>

      {allMatched && (
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-coral text-white font-display font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Submit Answer
        </button>
      )}

    </div>
  );
}

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}