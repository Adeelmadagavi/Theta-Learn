import { useState, useEffect, useRef } from 'react';

export default function MemoryEngine({ content, onComplete }) {
  const { instruction, pairs } = content;
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const startTime = useRef(Date.now());

  // Initialize and shuffle cards
  useEffect(() => {
    const cardArray = pairs.flatMap((pair, pairIndex) => [
      { id: `${pairIndex}-a`, content: pair.a, pairIndex },
      { id: `${pairIndex}-b`, content: pair.b, pairIndex }
    ]);
    
    const shuffled = cardArray.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairs]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.pairIndex === secondCard.pairIndex) {
        // Match found!
        setMatched(prev => [...prev, ...flipped]);
        setFlipped([]);
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
      
      setMoves(prev => prev + 1);
    }
  }, [flipped, cards]);

  // Check if game is complete
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const timeTakenSeconds = Math.floor((Date.now() - startTime.current) / 1000);
      
      setTimeout(() => {
        onComplete({
          correct: true,
          score: 1,
          timeTakenSeconds,
          moves // Can be used for bonus XP later
        });
      }, 500);
    }
  }, [matched, cards, onComplete]);

  const handleCardClick = (cardId) => {
    if (
      flipped.length === 2 ||
      flipped.includes(cardId) ||
      matched.includes(cardId)
    ) {
      return;
    }

    setFlipped(prev => [...prev, cardId]);
  };

  const isFlipped = (cardId) => flipped.includes(cardId) || matched.includes(cardId);
  const isMatched = (cardId) => matched.includes(cardId);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl2 shadow-md p-6 mb-4">
        <h2 className="font-display text-2xl text-ink mb-2">{instruction}</h2>
        <div className="flex justify-between font-body text-sm text-ink opacity-60">
          <span>Moves: {moves}</span>
          <span>Pairs found: {matched.length / 2} / {pairs.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={isFlipped(card.id)}
            className={`
              aspect-square rounded-lg font-body font-medium
              transition-all transform
              ${isFlipped(card.id)
                ? isMatched(card.id)
                  ? 'bg-mint text-white scale-95'
                  : 'bg-sky text-white'
                : 'bg-grape text-transparent hover:scale-105'
              }
              ${!isFlipped(card.id) ? 'cursor-pointer' : 'cursor-default'}
              flex items-center justify-center p-2 text-center text-sm
            `}
          >
            {isFlipped(card.id) ? card.content : '?'}
          </button>
        ))}
      </div>

      {matched.length === cards.length && cards.length > 0 && (
        <div className="mt-6 text-center">
          <div className="bg-mint bg-opacity-20 rounded-xl2 p-6">
            <div className="text-4xl mb-2">🎉</div>
            <div className="font-display text-xl text-ink">
              All pairs found in {moves} moves!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}