import { Question, QuizCategory, Achievement, LeaderboardUser, AppNotification } from '../types';

export const INITIAL_CATEGORIES: QuizCategory[] = [
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    icon: 'Brain',
    activeCount: 2500,
    tag: 'Popular',
    color: 'bg-primary text-on-primary',
    description: 'Master general trivia, world records & fascinating facts.'
  },
  {
    id: 'science',
    name: 'Science & Nature',
    icon: 'Atom',
    activeCount: 1420,
    color: 'bg-emerald-600 text-white',
    description: 'Physics, Chemistry, Biology & Natural Wonders.'
  },
  {
    id: 'history',
    name: 'History & Culture',
    icon: 'History',
    activeCount: 980,
    color: 'bg-amber-600 text-white',
    description: 'Ancient civilizations, world wars & historic milestones.'
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    activeCount: 1100,
    color: 'bg-blue-600 text-white',
    description: 'Capitals, physical landmarks, oceans & continents.'
  },
  {
    id: 'sports',
    name: 'Sports & Athletics',
    icon: 'Trophy',
    activeCount: 850,
    color: 'bg-red-600 text-white',
    description: 'Cricket, Football, Olympics & Sports legends.'
  },
  {
    id: 'india_gk',
    name: 'India GK',
    icon: 'Landmark',
    activeCount: 3100,
    tag: 'Trending',
    color: 'bg-orange-500 text-white',
    description: 'Indian history, constitution, states, culture & heritage.'
  },
  {
    id: 'world_gk',
    name: 'World GK',
    icon: 'Globe2',
    activeCount: 1750,
    color: 'bg-indigo-600 text-white',
    description: 'Global organizations, currencies, leaders & events.'
  },
  {
    id: 'technology',
    name: 'Technology & AI',
    icon: 'Cpu',
    activeCount: 2100,
    color: 'bg-teal-600 text-white',
    description: 'Computers, AI, Internet, Blockchain & Innovations.'
  },
  {
    id: 'space',
    name: 'Space & Astronomy',
    icon: 'Rocket',
    activeCount: 1340,
    tag: 'Special',
    color: 'bg-purple-700 text-white',
    description: 'Planets, galaxies, ISRO, NASA & cosmic mysteries.'
  },
  {
    id: 'politics',
    name: 'Politics & Civics',
    icon: 'Scale',
    activeCount: 720,
    color: 'bg-cyan-700 text-white',
    description: 'Governance, democratic systems, rights & law.'
  },
  {
    id: 'economics',
    name: 'Economics & Finance',
    icon: 'Coins',
    activeCount: 1650,
    tag: 'Essential',
    color: 'bg-yellow-600 text-white',
    description: 'Banking, investments, crypto, inflation & budgeting.'
  },
  {
    id: 'current_affairs',
    name: 'Current Affairs',
    icon: 'Newspaper',
    activeCount: 4200,
    tag: 'Daily',
    color: 'bg-rose-600 text-white',
    description: 'Latest national & international news headlines.'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Space / Science
  {
    id: 'q1',
    category: 'space',
    questionText: 'Which planet in our solar system is known as the "Red Planet"?',
    type: 'MCQ',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    explanation: 'Mars is called the Red Planet because the iron oxide on its surface gives it a reddish appearance.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'It is named after the Roman god of war.'
  },
  {
    id: 'q2',
    category: 'space',
    questionText: 'Is the Sun considered a medium-sized star classified as a Yellow Dwarf?',
    type: 'TrueFalse',
    options: ['True', 'False'],
    correctAnswerIndex: 0,
    explanation: 'Yes! The Sun is classified as a G-type main-sequence star (G2V), commonly known as a yellow dwarf.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Think about stellar spectral classification.'
  },
  {
    id: 'q3',
    category: 'space',
    questionText: 'What is the name of India\'s first lunar exploration mission launched by ISRO in 2008?',
    type: 'MCQ',
    options: ['Mangalyaan-1', 'Chandrayaan-1', 'Aditya-L1', 'Gaganyaan-1'],
    correctAnswerIndex: 1,
    explanation: 'Chandrayaan-1 was India\'s first lunar probe, launched in October 2008, which discovered water molecules on the Moon.',
    difficulty: 'Medium',
    rewardCoins: 15,
    hint: 'Chandra means Moon in Sanskrit.'
  },
  // India GK
  {
    id: 'q4',
    category: 'india_gk',
    questionText: 'Which article of the Constitution of India guarantees the "Right to Equality"?',
    type: 'MCQ',
    options: ['Articles 12-13', 'Articles 14-18', 'Articles 19-22', 'Articles 23-24'],
    correctAnswerIndex: 1,
    explanation: 'Articles 14 to 18 of the Indian Constitution deal with the Right to Equality before law and equal protection of law.',
    difficulty: 'Medium',
    rewardCoins: 15,
    hint: 'It comes right after the definition of State.'
  },
  {
    id: 'q5',
    category: 'india_gk',
    questionText: 'The National Anthem of India "Jana Gana Mana" was originally composed in which language?',
    type: 'MCQ',
    options: ['Hindi', 'Sanskrit', 'Bengali', 'Marathi'],
    correctAnswerIndex: 2,
    explanation: 'It was originally composed as Bharoto Bhagyo Bidhata in Bengali by Nobel laureate Rabindranath Tagore.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Rabindranath Tagore wrote in this eastern Indian language.'
  },
  // Technology & AI
  {
    id: 'q6',
    category: 'technology',
    questionText: 'What does the acronym "API" stand for in software development?',
    type: 'MCQ',
    options: [
      'Automated Program Integration',
      'Application Programming Interface',
      'Advanced Power Instruction',
      'Application Protocol Interaction'
    ],
    correctAnswerIndex: 1,
    explanation: 'API stands for Application Programming Interface, allowing different software applications to communicate with each other.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Interface for Application Programmers.'
  },
  {
    id: 'q7',
    category: 'technology',
    questionText: 'Which decentralized cryptographic technology powers Bitcoin and JK Coin ledger transparency?',
    type: 'MCQ',
    options: ['Cloud Computing', 'Blockchain', 'Quantum Computing', 'Neural Network'],
    correctAnswerIndex: 1,
    explanation: 'Blockchain is a distributed ledger technology that securely records transactions across a peer-to-peer network.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'A chain of cryptographic blocks.'
  },
  // Economics & Finance
  {
    id: 'q8',
    category: 'economics',
    questionText: 'What is the term used when general price levels rise, reducing purchasing power over time?',
    type: 'MCQ',
    options: ['Deflation', 'Stagflation', 'Inflation', 'Recession'],
    correctAnswerIndex: 2,
    explanation: 'Inflation is the rate at which the general level of prices for goods and services is rising and purchasing power is falling.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Prices expand or inflate.'
  },
  {
    id: 'q9',
    category: 'economics',
    questionText: 'Compound Interest yields higher returns than Simple Interest because interest is earned on both principal and accumulated interest.',
    type: 'TrueFalse',
    options: ['True', 'False'],
    correctAnswerIndex: 0,
    explanation: 'True! Compound interest calculates interest on the initial principal plus all of the accumulated interest from previous periods.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Interest on interest!'
  },
  // Science & Nature
  {
    id: 'q10',
    category: 'science',
    questionText: 'What is the chemical symbol for Gold on the periodic table?',
    type: 'MCQ',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswerIndex: 2,
    explanation: 'Au comes from the Latin word "Aurum", which means glowing dawn and refers to Gold.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Derived from Latin word Aurum.'
  },
  {
    id: 'q11',
    category: 'science',
    questionText: 'Which human organ consumes approximately 20% of the body\'s total oxygen supply?',
    type: 'MCQ',
    options: ['Heart', 'Brain', 'Lungs', 'Liver'],
    correctAnswerIndex: 1,
    explanation: 'Despite representing only about 2% of total body weight, the human brain uses about 20% of oxygen and blood flow.',
    difficulty: 'Medium',
    rewardCoins: 15,
    hint: 'The center of your nervous system.'
  },
  // History
  {
    id: 'q12',
    category: 'history',
    questionText: 'In which year did the Industrial Revolution begin in Great Britain?',
    type: 'MCQ',
    options: ['1650', '1760', '1850', '1914'],
    correctAnswerIndex: 1,
    explanation: 'The Industrial Revolution began around 1760 with key inventions in mechanization, steam engines, and textile manufacturing.',
    difficulty: 'Hard',
    rewardCoins: 25,
    hint: 'Mid to late 18th century.'
  },
  // General Knowledge
  {
    id: 'q13',
    category: 'general_knowledge',
    questionText: 'Which ocean is the largest and deepest ocean on Earth?',
    type: 'MCQ',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctAnswerIndex: 2,
    explanation: 'The Pacific Ocean covers over 63 million square miles and contains the deepest point on Earth, the Mariana Trench.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Its name means peaceful.'
  },
  {
    id: 'q14',
    category: 'sports',
    questionText: 'How many players are on the field for one team in a standard regulation Cricket match?',
    type: 'MCQ',
    options: ['9', '10', '11', '12'],
    correctAnswerIndex: 2,
    explanation: 'A cricket team consists of 11 players on the field during a match.',
    difficulty: 'Easy',
    rewardCoins: 10,
    hint: 'Same number of players as in Football (Soccer).'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Win',
    description: 'Complete your first quiz with a passing score.',
    icon: 'Award',
    category: 'quiz',
    targetCount: 1,
    currentCount: 1,
    unlocked: true,
    rewardCoins: 50
  },
  {
    id: 'streak_7',
    title: '7 Day Streak',
    description: 'Log in and play quizzes for 7 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    targetCount: 7,
    currentCount: 7,
    unlocked: true,
    rewardCoins: 150
  },
  {
    id: 'quiz_master_100',
    title: 'Century Scholar',
    description: 'Answer 100 questions correctly.',
    icon: 'Zap',
    category: 'quiz',
    targetCount: 100,
    currentCount: 34,
    unlocked: false,
    rewardCoins: 300
  },
  {
    id: 'perfect_score',
    title: 'Flawless Victory',
    description: 'Achieve a 100% score on a quiz with 5 or more questions.',
    icon: 'Sparkles',
    category: 'quiz',
    targetCount: 1,
    currentCount: 1,
    unlocked: true,
    rewardCoins: 100
  },
  {
    id: 'referral_champion',
    title: 'Ambassador',
    description: 'Invite 5 friends who sign up with your code.',
    icon: 'Users',
    category: 'social',
    targetCount: 5,
    currentCount: 3,
    unlocked: false,
    rewardCoins: 400
  },
  {
    id: 'streak_30',
    title: 'Monthly Legend',
    description: 'Maintain a 30 day daily quiz streak.',
    icon: 'Calendar',
    category: 'streak',
    targetCount: 30,
    currentCount: 7,
    unlocked: false,
    rewardCoins: 1000
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    uid: 'u1',
    name: 'Sarah Williams',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    xp: 58200,
    title: 'Elite Scholar',
    coins: 4850
  },
  {
    rank: 2,
    uid: 'u2',
    name: 'Alex Rivera',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    xp: 42500,
    title: 'Savvy Investor',
    coins: 3400
  },
  {
    rank: 3,
    uid: 'u3',
    name: 'David Ling',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    xp: 38900,
    title: 'Pro Trader',
    coins: 2950
  },
  {
    rank: 4,
    uid: 'u4',
    name: 'Emma Wilson',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    xp: 31450,
    title: 'Fast Learner',
    coins: 2100
  },
  {
    rank: 5,
    uid: 'u5',
    name: 'Marcus Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    xp: 28120,
    title: 'Streak Expert',
    coins: 1850
  },
  {
    rank: 6,
    uid: 'u6',
    name: 'Sophia Rossi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    xp: 25900,
    title: 'Market Oracle',
    coins: 1600
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Daily Bonus Available!',
    message: 'Claim your +20 JK Coins today. Don\'t break your 7-day streak!',
    timestamp: '2m ago',
    type: 'reward',
    read: false
  },
  {
    id: 'n2',
    title: 'Alex challenged you',
    message: 'Think you know more about Science? Alex sent you a 5-question duel.',
    timestamp: '1h ago',
    type: 'challenge',
    read: false
  },
  {
    id: 'n3',
    title: 'New Achievement Unlocked!',
    message: 'You reached the "Flawless Victory" tier! +100 Coins added.',
    timestamp: '4h ago',
    type: 'achievement',
    read: true
  },
  {
    id: 'n4',
    title: 'Weekly Leaderboard Rewards',
    message: 'Congratulations! You earned a top spot bonus this week.',
    timestamp: '1d ago',
    type: 'system',
    read: true
  }
];
