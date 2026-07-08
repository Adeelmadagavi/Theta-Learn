// Seeds subjects, topics, activities and badges.
// Run once: `node db/seed.js` (safe to re-run -- clears activity/topic/subject tables first)
const db = require('./database');

db.exec(`
  DELETE FROM activities;
  DELETE FROM topics;
  DELETE FROM subjects;
  DELETE FROM badges;
`);

const insertSubject = db.prepare('INSERT INTO subjects (name) VALUES (?)');
const insertTopic = db.prepare('INSERT INTO topics (subject_id, name, order_index) VALUES (?, ?, ?)');
const insertActivity = db.prepare(`
  INSERT INTO activities (topic_id, type, title, content_json, difficulty, base_xp, base_coins, order_index)
  VALUES (@topic_id, @type, @title, @content_json, @difficulty, @base_xp, @base_coins, @order_index)
`);

const mathId = insertSubject.run('Mathematics').lastInsertRowid;
const sciId = insertSubject.run('Science').lastInsertRowid;

// ---- Topic data. Each topic: { name, activities: [ {type, title, difficulty, content} ] } ----
// Content is original / rule-based (no scraped textbook text) -- fill in more per-topic detail
// as time allows, this gives you a working end-to-end slice across every engine type.

const mathTopics = [
  {
    name: 'Numbers',
    activities: [
      { type: 'quiz', title: 'Prime or Composite?', difficulty: 1, content: {
        question: 'Which of these numbers is a prime number?',
        options: ['21', '29', '33', '39'],
        answerIndex: 1,
        explanation: '29 has no divisors other than 1 and itself.'
      }},
      { type: 'sequence', title: 'Arrange Ascending', difficulty: 1, content: {
        instruction: 'Drag the numbers into ascending order.',
        steps: ['12', '45', '78', '103']
      }},
      { type: 'dragdrop', title: 'Even vs Odd Sort', difficulty: 2, content: {
        instruction: 'Drag each number to Even or Odd.',
        items: ['14', '27', '32', '49'],
        targets: ['Even', 'Odd'],
        correctMap: { '14': 'Even', '27': 'Odd', '32': 'Even', '49': 'Odd' }
      }}
    ]
  },
  {
    name: 'Fractions',
    activities: [
      { type: 'quiz', title: 'Simplify the Fraction', difficulty: 1, content: {
        question: 'What is 8/12 in simplest form?',
        options: ['2/3', '4/6', '1/2', '3/4'],
        answerIndex: 0,
        explanation: 'Divide numerator and denominator by their GCD, 4.'
      }},
      { type: 'match', title: 'Match Equivalent Fractions', difficulty: 2, content: {
        instruction: 'Match each fraction to its equivalent.',
        pairs: [
          { left: '1/2', right: '2/4' },
          { left: '1/3', right: '2/6' },
          { left: '3/4', right: '6/8' }
        ]
      }},
      { type: 'memory', title: 'Fraction Memory Match', difficulty: 2, content: {
        instruction: 'Flip cards to find matching fraction pairs.',
        pairs: [
          { a: '1/4', b: '2/8' },
          { a: '3/5', b: '6/10' }
        ]
      }}
    ]
  },
  {
    name: 'Geometry',
    activities: [
      { type: 'quiz', title: 'Identify the Shape', difficulty: 1, content: {
        question: 'A shape with 3 sides and 3 angles is called a:',
        options: ['Triangle', 'Rectangle', 'Pentagon', 'Hexagon'],
        answerIndex: 0,
        explanation: 'A triangle always has 3 sides and 3 angles.'
      }},
      { type: 'dragdrop', title: 'Label the Angles', difficulty: 2, content: {
        instruction: 'Drag each angle value to Acute, Right, or Obtuse.',
        items: ['45°', '90°', '120°'],
        targets: ['Acute', 'Right', 'Obtuse'],
        correctMap: { '45°': 'Acute', '90°': 'Right', '120°': 'Obtuse' }
      }},
      { type: 'sequence', title: 'Sides: Least to Most', difficulty: 2, content: {
        instruction: 'Order these shapes by number of sides, fewest first.',
        steps: ['Triangle', 'Square', 'Pentagon', 'Hexagon']
      }}
    ]
  },
  {
    name: 'Algebra',
    activities: [
      { type: 'quiz', title: 'Solve for x', difficulty: 2, content: {
        question: 'If x + 5 = 12, what is x?',
        options: ['5', '6', '7', '8'],
        answerIndex: 2,
        explanation: 'Subtract 5 from both sides: x = 7.'
      }},
      { type: 'match', title: 'Match Expression to Value', difficulty: 2, content: {
        instruction: 'Match each expression (x=3) to its value.',
        pairs: [
          { left: '2x', right: '6' },
          { left: 'x + 4', right: '7' },
          { left: 'x²', right: '9' }
        ]
      }},
      { type: 'quiz', title: 'Like Terms', difficulty: 1, content: {
        question: 'Which term can be combined with 3x?',
        options: ['3x²', '5x', '3y', '5'],
        answerIndex: 1,
        explanation: 'Only terms with the same variable and power combine: 3x + 5x = 8x.'
      }}
    ]
  },
  {
    name: 'Mensuration',
    activities: [
      { type: 'quiz', title: 'Area of a Rectangle', difficulty: 1, content: {
        question: 'A rectangle is 6cm by 4cm. What is its area?',
        options: ['10 cm²', '20 cm²', '24 cm²', '28 cm²'],
        answerIndex: 2,
        explanation: 'Area = length × breadth = 6 × 4 = 24 cm².'
      }},
      { type: 'dragdrop', title: 'Match Shape to Formula', difficulty: 3, content: {
        instruction: 'Drag each shape to its correct area formula.',
        items: ['Square', 'Circle', 'Triangle'],
        targets: ['side²', 'πr²', '½ × base × height'],
        correctMap: { 'Square': 'side²', 'Circle': 'πr²', 'Triangle': '½ × base × height' }
      }},
      { type: 'sequence', title: 'Perimeter Steps', difficulty: 2, content: {
        instruction: 'Order the steps to find a rectangle\'s perimeter.',
        steps: ['Measure length', 'Measure breadth', 'Add length + breadth', 'Multiply sum by 2']
      }}
    ]
  }
];

const sciTopics = [
  {
    name: 'Plants',
    activities: [
      { type: 'quiz', title: 'Parts of a Plant', difficulty: 1, content: {
        question: 'Which part of the plant absorbs water and minerals from soil?',
        options: ['Leaf', 'Root', 'Flower', 'Stem'],
        answerIndex: 1,
        explanation: 'Roots absorb water and minerals and anchor the plant.'
      }},
      { type: 'match', title: 'Match Part to Function', difficulty: 2, content: {
        instruction: 'Match each plant part to its function.',
        pairs: [
          { left: 'Leaf', right: 'Photosynthesis' },
          { left: 'Root', right: 'Absorption' },
          { left: 'Flower', right: 'Reproduction' }
        ]
      }},
      { type: 'memory', title: 'Plant Parts Memory', difficulty: 1, content: {
        instruction: 'Flip cards to match plant part with its picture label.',
        pairs: [
          { a: 'Root', b: '🌱 Underground' },
          { a: 'Flower', b: '🌸 Colorful' }
        ]
      }}
    ]
  },
  {
    name: 'Human Body',
    activities: [
      { type: 'quiz', title: 'Organ Function', difficulty: 1, content: {
        question: 'Which organ pumps blood throughout the body?',
        options: ['Lungs', 'Heart', 'Kidney', 'Liver'],
        answerIndex: 1,
        explanation: 'The heart pumps blood through the circulatory system.'
      }},
      { type: 'dragdrop', title: 'Sort Organs by System', difficulty: 2, content: {
        instruction: 'Drag each organ to its correct body system.',
        items: ['Heart', 'Lungs', 'Stomach'],
        targets: ['Circulatory', 'Respiratory', 'Digestive'],
        correctMap: { 'Heart': 'Circulatory', 'Lungs': 'Respiratory', 'Stomach': 'Digestive' }
      }},
      { type: 'sequence', title: 'Path of Food', difficulty: 2, content: {
        instruction: 'Order the path food takes through the digestive system.',
        steps: ['Mouth', 'Esophagus', 'Stomach', 'Small Intestine']
      }}
    ]
  },
  {
    name: 'Force and Motion',
    activities: [
      { type: 'quiz', title: 'Newton\'s First Law', difficulty: 2, content: {
        question: 'An object at rest stays at rest unless acted upon by a(n):',
        options: ['Unbalanced force', 'Shadow', 'Color', 'Sound'],
        answerIndex: 0,
        explanation: 'This is Newton\'s First Law -- the law of inertia.'
      }},
      { type: 'match', title: 'Match Force Type to Example', difficulty: 2, content: {
        instruction: 'Match each force type to an everyday example.',
        pairs: [
          { left: 'Friction', right: 'Rubbing hands together' },
          { left: 'Gravity', right: 'A ball falling down' },
          { left: 'Magnetic', right: 'Compass needle turning' }
        ]
      }},
      { type: 'quiz', title: 'Speed Calculation', difficulty: 2, content: {
        question: 'A car travels 100 km in 2 hours. What is its speed?',
        options: ['25 km/h', '50 km/h', '100 km/h', '200 km/h'],
        answerIndex: 1,
        explanation: 'Speed = distance ÷ time = 100 ÷ 2 = 50 km/h.'
      }}
    ]
  },
  {
    name: 'Electricity',
    activities: [
      { type: 'quiz', title: 'Conductors vs Insulators', difficulty: 1, content: {
        question: 'Which material is the best conductor of electricity?',
        options: ['Rubber', 'Copper', 'Wood', 'Plastic'],
        answerIndex: 1,
        explanation: 'Copper is a metal and conducts electricity very well.'
      }},
      { type: 'dragdrop', title: 'Sort Conductors and Insulators', difficulty: 2, content: {
        instruction: 'Drag each material to Conductor or Insulator.',
        items: ['Copper wire', 'Rubber glove', 'Iron nail', 'Wooden ruler'],
        targets: ['Conductor', 'Insulator'],
        correctMap: { 'Copper wire': 'Conductor', 'Rubber glove': 'Insulator', 'Iron nail': 'Conductor', 'Wooden ruler': 'Insulator' }
      }},
      { type: 'sequence', title: 'Circuit Assembly Order', difficulty: 3, content: {
        instruction: 'Order the steps to complete a simple circuit.',
        steps: ['Connect battery', 'Connect wire to bulb', 'Close the switch', 'Bulb lights up']
      }}
    ]
  },
  {
    name: 'Environment',
    activities: [
      { type: 'quiz', title: 'Renewable Resources', difficulty: 1, content: {
        question: 'Which of these is a renewable resource?',
        options: ['Coal', 'Solar energy', 'Petroleum', 'Natural gas'],
        answerIndex: 1,
        explanation: 'Solar energy is naturally replenished and does not run out.'
      }},
      { type: 'match', title: 'Match Waste to Bin', difficulty: 1, content: {
        instruction: 'Match each waste item to the correct disposal type.',
        pairs: [
          { left: 'Banana peel', right: 'Biodegradable' },
          { left: 'Plastic bottle', right: 'Non-biodegradable' },
          { left: 'Newspaper', right: 'Recyclable' }
        ]
      }},
      { type: 'memory', title: 'Ecosystem Memory Match', difficulty: 2, content: {
        instruction: 'Flip cards to match organism with its role.',
        pairs: [
          { a: 'Plant', b: 'Producer' },
          { a: 'Lion', b: 'Consumer' }
        ]
      }}
    ]
  }
];

function seedSubjectTopics(subjectId, topicsArr) {
  topicsArr.forEach((topic, ti) => {
    const topicId = insertTopic.run(subjectId, topic.name, ti).lastInsertRowid;
    topic.activities.forEach((act, ai) => {
      insertActivity.run({
        topic_id: topicId,
        type: act.type,
        title: act.title,
        content_json: JSON.stringify(act.content),
        difficulty: act.difficulty,
        base_xp: 10 * act.difficulty,
        base_coins: act.difficulty,
        order_index: ai
      });
    });
  });
}

seedSubjectTopics(mathId, mathTopics);
seedSubjectTopics(sciId, sciTopics);

// ---- Badges (rule-based conditions, checked server-side after each attempt) ----
const insertBadge = db.prepare('INSERT INTO badges (name, description, condition_type, condition_value, icon) VALUES (?, ?, ?, ?, ?)');
insertBadge.run('First Steps', 'Complete your first activity', 'activities_completed', 1, '🎯');
insertBadge.run('Getting Warmed Up', 'Complete 10 activities', 'activities_completed', 10, '🔥');
insertBadge.run('Halfway Hero', 'Complete 15 activities', 'activities_completed', 15, '🏆');
insertBadge.run('Completionist', 'Complete all 30 activities', 'activities_completed', 30, '👑');
insertBadge.run('3-Day Streak', 'Log in and practice 3 days in a row', 'streak', 3, '🔥');
insertBadge.run('7-Day Streak', 'Log in and practice 7 days in a row', 'streak', 7, '⚡');
insertBadge.run('Sharp Shooter', 'Get 5 perfect scores', 'perfect_scores', 5, '🎯');

const totalActivities = db.prepare('SELECT COUNT(*) as c FROM activities').get().c;
console.log(`Seed complete. Subjects: 2, Topics: ${mathTopics.length + sciTopics.length}, Activities: ${totalActivities}, Badges: 7`);
