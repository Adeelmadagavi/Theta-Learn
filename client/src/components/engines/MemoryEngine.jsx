import { useState, useEffect, useRef } from 'react';

export default function MemoryEngine({ content, onComplete }) {
  const {
    instruction = '',
    pairs = []
  } = content || {};

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const startTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  useEffect(() => {
    const deck = [];

    pairs.forEach((pair, index) => {
      deck.push({
        id: `${index}-a`,
        content: pair.a,
        pairIndex: index
      });

      deck.push({
        id: `${index}-b`,
        content: pair.b,
        pairIndex: index
      });
    });

    setCards(shuffle(deck));
  }, [pairs]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    const first = cards.find(c => c.id === flipped[0]);
    const second = cards.find(c => c.id === flipped[1]);

    if (!first || !second) return;

    setMoves(prev => prev + 1);

    if (first.pairIndex === second.pairIndex) {
      setMatched(prev => [...prev, first.id, second.id]);
      setFlipped([]);
    } else {
      const timer = setTimeout(() => {
        setFlipped([]);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (
      cards.length > 0 &&
      matched.length === cards.length &&
      !hasCompleted.current
    ) {
      hasCompleted.current = true;

      const timeTakenSeconds = Math.floor(
        (Date.now() - startTime.current) / 1000
      );

      setTimeout(() => {
        onComplete({
          correct: true,
          score: 1,
          timeTakenSeconds,
          moves: moves + 1
        });
      }, 500);
    }
  }, [matched, cards, moves, onComplete]);

  function handleCardClick(cardId) {
    if (
      flipped.length >= 2 ||
      flipped.includes(cardId) ||
      matched.includes(cardId)
    ) {
      return;
    }

    setFlipped(prev => [...prev, cardId]);
  }

  function isFlipped(cardId) {
    return (
      flipped.includes(cardId) ||
      matched.includes(cardId)
    );
  }

  function isMatched(cardId) {
    return matched.includes(cardId);
  }

  return (
    <div className="max-w-xl mx-auto">

      <div className="bg-white rounded-xl2 shadow-md p-6 mb-5">
        <h2 className="font-display text-2xl text-ink mb-2">
          {instruction}
        </h2>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Moves: {moves}</span>
          <span>
            Pairs: {matched.length / 2} / {pairs.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={isFlipped(card.id)}
            className={`
              aspect-square rounded-lg p-2 text-center
              transition-all font-medium flex items-center justify-center
              ${
                isFlipped(card.id)
                  ? isMatched(card.id)
                    ? 'bg-mint text-white'
                    : 'bg-sky text-white'
                  : 'bg-grape text-transparent hover:scale-105'
              }
            `}
          >
            {isFlipped(card.id) ? card.content : '?'}
          </button>
        ))}
      </div>

      {cards.length > 0 &&
        matched.length === cards.length && (
          <div className="mt-6 text-center">
            <div className="bg-mint bg-opacity-20 rounded-xl2 p-6">
              <div className="text-4xl mb-2">
                🎉
              </div>

              <div className="font-display text-xl text-ink">
                Memory Challenge Complete!
              </div>

              <div className="text-gray-600 mt-2">
                Completed in {moves} moves
              </div>
            </div>
          </div>
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