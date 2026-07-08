import { useState, useRef } from 'react';

export default function DragDropEngine({ content, onComplete }) {
  const {
    instruction = '',
    items = [],
    targets = [],
    correctMap = {}
  } = content || {};

  const [placements, setPlacements] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const startTime = useRef(Date.now());

  const unplacedItems = items.filter(item => !placements[item]);
  const allPlaced = items.length > 0 && items.every(item => placements[item]);

  // Desktop drag
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const assignItem = (item, target) => {
    setPlacements(prev => {
      const updated = { ...prev };

      // Remove any item already occupying this target
      Object.keys(updated).forEach(key => {
        if (updated[key] === target) {
          delete updated[key];
        }
      });

      updated[item] = target;
      return updated;
    });

    setDraggedItem(null);
  };

  const handleDrop = (e, target) => {
    e.preventDefault();

    if (draggedItem) {
      assignItem(draggedItem, target);
    }
  };

  // Mobile support
  const handleItemClick = (item) => {
    setDraggedItem(item);
  };

  const handleTargetClick = (target) => {
    if (draggedItem) {
      assignItem(draggedItem, target);
    }
  };

  const handleRemove = (item) => {
    setPlacements(prev => {
      const updated = { ...prev };
      delete updated[item];
      return updated;
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;

    items.forEach(item => {
      const placed =
        (placements[item] || '').toString().trim().toLowerCase();

      const expected =
        (correctMap[item] || '').toString().trim().toLowerCase();

      if (placed === expected) {
        correctCount++;
      }
    });

    const score =
      items.length > 0 ? correctCount / items.length : 0;

    const timeTakenSeconds = Math.floor(
      (Date.now() - startTime.current) / 1000
    );

    onComplete({
      correct: score === 1,
      score,
      timeTakenSeconds
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl2 shadow-md p-6 mb-6">
        <h2 className="font-display text-2xl text-ink mb-4">
          {instruction}
        </h2>

        {/* Unplaced Items */}
        <div className="mb-6">
          <h3 className="font-display text-sm text-ink opacity-60 mb-3">
            Items to place:
          </h3>

          <div className="flex flex-wrap gap-3">
            {unplacedItems.map(item => (
              <button
                key={item}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => handleItemClick(item)}
                className={`px-4 py-2 rounded-lg font-body font-medium transition-all cursor-move ${
                  draggedItem === item
                    ? 'bg-sunshine text-ink scale-105 ring-2 ring-sunshine'
                    : 'bg-sky text-white hover:scale-105'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {draggedItem && (
            <p className="text-sm text-grape mt-3 font-body">
              👆 Click a target below to place "{draggedItem}"
            </p>
          )}
        </div>

        {/* Targets */}
        <div className="space-y-3">
          {targets.map(target => {
            const placedItem = Object.entries(placements).find(
              ([, value]) => value === target
            )?.[0];

            return (
              <div
                key={target}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, target)}
                onClick={() =>
                  !placedItem && handleTargetClick(target)
                }
                className={`border-2 border-dashed rounded-lg p-4 transition-all min-h-[60px] flex items-center justify-between ${
                  draggedItem && !placedItem
                    ? 'border-sunshine bg-sunshine bg-opacity-10 cursor-pointer'
                    : 'border-ink border-opacity-20'
                } ${
                  placedItem
                    ? 'bg-mint bg-opacity-10'
                    : ''
                }`}
              >
                <div>
                  <div className="font-display text-sm text-ink opacity-60">
                    {target}
                  </div>

                  {placedItem && (
                    <div className="font-body text-ink mt-1 font-medium">
                      {placedItem}
                    </div>
                  )}
                </div>

                {placedItem && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(placedItem);
                    }}
                    className="text-coral hover:text-red-600 font-bold text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {allPlaced && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-coral text-white font-display font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
}