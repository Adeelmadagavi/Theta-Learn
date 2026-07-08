import { useState, useRef, useEffect } from 'react';

export default function SequenceEngine({ content, onComplete }) {
  const { instruction, steps } = content;
  const [currentSteps, setCurrentSteps] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const startTime = useRef(Date.now());

  // Shuffle steps on mount
  useEffect(() => {
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setCurrentSteps(shuffled);
  }, [steps]);

  const moveStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === currentSteps.length - 1)
    ) {
      return;
    }

    const newSteps = [...currentSteps];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];
    setCurrentSteps(newSteps);
  };

  // Desktop drag-and-drop
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const newSteps = [...currentSteps];
    const [draggedItem] = newSteps.splice(dragIndex, 1);
    newSteps.splice(dropIndex, 0, draggedItem);
    setCurrentSteps(newSteps);
  };

  const calculateScore = () => {
    // Check if completely correct
    const isExact = currentSteps.every((step, i) => step === steps[i]);
    if (isExact) return 1;

    // Partial credit: longest correct consecutive run
    let maxRun = 0;
    let currentRun = 0;
    
    for (let i = 0; i < steps.length; i++) {
      if (currentSteps[i] === steps[i]) {
        currentRun++;
        maxRun = Math.max(maxRun, currentRun);
      } else {
        currentRun = 0;
      }
    }

    return maxRun / steps.length;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const timeTakenSeconds = Math.floor((Date.now() - startTime.current) / 1000);
    
    setSubmitted(true);
    
    setTimeout(() => {
      onComplete({
        correct: score === 1,
        score,
        timeTakenSeconds
      });
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl2 shadow-md p-6">
        <h2 className="font-display text-2xl text-ink mb-4">{instruction}</h2>
        
        <p className="font-body text-ink opacity-60 text-sm mb-6">
          Arrange the steps in the correct order. Use drag-and-drop or the arrow buttons.
        </p>

        <div className="space-y-3 mb-6">
          {currentSteps.map((step, index) => {
            const isCorrect = submitted && step === steps[index];
            const isWrong = submitted && step !== steps[index];

            return (
              <div
                key={index}
                draggable={!submitted}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2
                  transition-all
                  ${submitted 
                    ? isCorrect 
                      ? 'bg-mint bg-opacity-20 border-mint' 
                      : 'bg-coral bg-opacity-10 border-coral border-opacity-30'
                    : 'bg-white border-ink border-opacity-20 hover:border-sky cursor-move'
                  }
                `}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ink bg-opacity-10 flex items-center justify-center font-display font-bold text-ink">
                  {index + 1}
                </div>
                
                <div className="flex-1 font-body text-ink">
                  {step}
                </div>

                {!submitted && (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="w-8 h-8 bg-sky text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80 font-bold"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === currentSteps.length - 1}
                      className="w-8 h-8 bg-sky text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-opacity-80 font-bold"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                )}

                {submitted && (
                  <div className="flex-shrink-0 text-2xl">
                    {isCorrect ? '✓' : '✗'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted && (
          <button
            onClick={handleSubmit}
            className="w-full bg-coral text-white font-display font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
          >
            Submit Order
          </button>
        )}

        {submitted && (
          <div className="text-center font-body text-ink opacity-60">
            {calculateScore() === 1 ? '🎉 Perfect!' : '📝 Reviewing your answer...'}
          </div>
        )}
      </div>
    </div>
  );
}