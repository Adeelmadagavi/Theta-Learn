import { useState, useEffect, useRef } from "react";

export default function SequenceEngine({ content, onComplete }) {
  const { instruction, steps } = content;

  const [currentSteps, setCurrentSteps] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const dragIndex = useRef(null);
  const startTime = useRef(Date.now());
  const completed = useRef(false);

  // Shuffle only once
  useEffect(() => {
    const shuffled = [...steps];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCurrentSteps(shuffled);
  }, [steps]);

  // Move Up / Down
  function move(index, direction) {
    if (submitted) return;

    const arr = [...currentSteps];

    if (direction === "up" && index > 0) {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
    }

    if (direction === "down" && index < arr.length - 1) {
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    }

    setCurrentSteps(arr);
  }

  // Drag handlers
  function handleDragStart(index) {
    dragIndex.current = index;
  }

  function handleDrop(index) {
    if (submitted) return;

    const arr = [...currentSteps];

    const dragged = arr[dragIndex.current];

    arr.splice(dragIndex.current, 1);

    arr.splice(index, 0, dragged);

    setCurrentSteps(arr);
  }

  // Score calculation
  function calculateScore() {
    let correct = 0;

    currentSteps.forEach((step, i) => {
      if (step === steps[i]) correct++;
    });

    return correct / steps.length;
  }

  function handleSubmit() {
    if (submitted || completed.current) return;

    completed.current = true;

    const finalScore = calculateScore();

    setScore(finalScore);

    setSubmitted(true);

    const timeTakenSeconds = Math.floor(
      (Date.now() - startTime.current) / 1000
    );

    setTimeout(() => {
      onComplete({
        correct: finalScore === 1,
        score: finalScore,
        timeTakenSeconds,
      });
    }, 1200);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl2 shadow-md p-6">

      <h2 className="font-display text-2xl mb-2">
        {instruction}
      </h2>

      <p className="text-gray-500 mb-6">
        Arrange the steps in the correct order.
      </p>

      <div className="space-y-3">

        {currentSteps.map((step, index) => {

          const correct = step === steps[index];

          return (

            <div
              key={index}
              draggable={!submitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
              className={`
                flex items-center gap-4
                border rounded-lg p-4
                transition-all

                ${
                  submitted
                    ? correct
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-400"
                    : "hover:border-sky cursor-move"
                }
              `}
            >

              <div className="w-9 h-9 rounded-full bg-sky text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <div className="flex-1">
                {step}
              </div>

              {!submitted && (
                <div className="flex flex-col gap-1">

                  <button
                    onClick={() => move(index, "up")}
                    disabled={index === 0}
                    className="px-2 py-1 bg-sky text-white rounded disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    onClick={() => move(index, "down")}
                    disabled={index === currentSteps.length - 1}
                    className="px-2 py-1 bg-sky text-white rounded disabled:opacity-30"
                  >
                    ↓
                  </button>

                </div>
              )}

              {submitted && (
                <div className="text-2xl">
                  {correct ? "✅" : "❌"}
                </div>
              )}

            </div>

          );
        })}

      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-3 rounded-xl2 bg-coral text-white font-display font-bold hover:opacity-90"
        >
          Submit Order
        </button>
      ) : (
        <div className="mt-6 text-center">

          <div className="text-3xl mb-2">
            {score === 1 ? "🎉" : "📚"}
          </div>

          <h3 className="font-display text-xl">

            {score === 1
              ? "Perfect Order!"
              : `Score: ${Math.round(score * 100)}%`}

          </h3>

          <p className="text-gray-500 mt-2">
            {score === 1
              ? "Excellent! Everything is in the correct order."
              : "Review the highlighted steps and try again next time."}
          </p>

        </div>
      )}

    </div>
  );
}