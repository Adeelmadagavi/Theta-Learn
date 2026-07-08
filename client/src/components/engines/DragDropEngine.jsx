import { useState, useRef } from 'react';

export default function DragDropEngine({ content, onComplete }) {
  const { instruction, items, targets, correctMap } = content;
  const [placements, setPlacements] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const startTime = useRef(Date.now());

  const unplacedItems = items.filter(item => !placements[item]);
  const allPlaced = items.every(item => placements[item]);

  // Desktop drag handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: target }));
      setDraggedItem(null);
    }
  };

  // Mobile click-to-assign fallback
  const handleItemClick = (item) => {
    setDraggedItem(item);
  };

  const handleTargetClick = (target) => {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: target }));
      setDraggedItem(null);
    }
  };

  const handleSubmit = () => {
    const correctCount = items.filter(item => 
      placements[item] === correctMap[item]
    ).length;
    
    const score = correctCount / items.length;
    const timeTakenSeconds = Math.floor((Date.now() - startTime.current) / 1000);
    
    onComplete({
      correct: score === 1,
      score,
      timeTakenSeconds
    });
  };

  const handleRemove = (item) => {
    setPlacements(prev => {
      const updated = { ...prev };
      delete updated[item];
      return updated;
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl2 shadow-md p-6 mb-6">
        <h2 className="font-display text-2xl text-ink mb-4">{instruction}</h2>
        
        {/* Unplaced Items */}
        <div className="mb-6">
          <h3 className="font-display text-sm text-ink opacity-60 mb-3">Items to place:</h3>
          <div className="flex flex-wrap gap-3">
            {unplacedItems.map(item => (
              <button
                key={item}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => handleItemClick(item)}
                className={`
                  px-4 py-2 rounded-lg font-body font-medium
                  transition-all cursor-move
                  ${draggedItem === item 
                    ? 'bg-sunshine text-ink scale-105 ring-2 ring-sunshine' 
                    : 'bg-sky text-white hover:scale-105'
                  }
                `}
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

        {/* Target Zones */}
        <div className="space-y-3">
          {targets.map(target => {
            const placedItem = Object.entries(placements).find(
              ([_, t]) => t === target
            )?.[0];

            return (
              <div
                key={target}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, target)}
                onClick={() => !placedItem && handleTargetClick(target)}
                className={`
                  border-2 border-dashed rounded-lg p-4
                  transition-all min-h-[60px] flex items-center justify-between
                  ${draggedItem && !placedItem
                    ? 'border-sunshine bg-sunshine bg-opacity-10 cursor-pointer' 
                    : 'border-ink border-opacity-20'
                  }
                  ${placedItem ? 'bg-mint bg-opacity-10' : ''}
                `}
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
                    aria-label="Remove item"
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