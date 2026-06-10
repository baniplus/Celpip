// Lessons, tricks & tips for reaching CELPIP 12. Grouped by skill.
// `phrases` (optional) are tappable to hear them spoken aloud.

export const LESSONS = [
  {
    id: "L1", skill: "Speaking", icon: "🎙", title: "The confident opener",
    summary: "Start every speaking task with a first sentence that scores.",
    points: [
      "Never start with silence or 'umm'. Open with a full, grammatical sentence that restates the task — it buys thinking time and sets a fluent tone.",
      "For opinions/advice, state your position immediately. The rater hears confidence in the first 5 seconds.",
      "Use a 'signpost' so your answer has visible structure: 'There are two main reasons…'.",
      "Banish dead air with thinking phrases instead of fillers."
    ],
    phrases: [
      "Honestly, if I were in your position, I'd do two things.",
      "That's an interesting question — let me give you my take on it.",
      "There are a couple of reasons I feel strongly about this."
    ]
  },
  {
    id: "L2", skill: "Speaking", icon: "🎙", title: "Stretch your answer to the bell",
    summary: "Run out of ideas? Techniques to keep speaking naturally until time is up.",
    points: [
      "Use the PREP frame: Point, Reason, Example, Point again. The Example is where you add 15–20 easy seconds.",
      "Add a personal anecdote: 'This actually happened to a friend of mine…'. Stories are easy to extend and sound natural.",
      "Address the opposite view and dismiss it: 'Now, some people might say…, but I'd argue…'.",
      "End deliberately — don't trail off. A clean closing line signals control: 'So that's why I'd go with the first option.'"
    ],
    phrases: [
      "Let me give you a quick example of what I mean.",
      "This actually reminds me of something that happened to me.",
      "So, all things considered, that's the way I'd approach it."
    ]
  },
  {
    id: "L3", skill: "Listening", icon: "🎧", title: "Predict, then listen",
    summary: "Top scorers listen actively, not passively.",
    points: [
      "Before audio plays, read the question stems and predict what information you'll need (a reason? a number? a feeling?).",
      "Listen for signposts: 'however', 'the main problem', 'in the end' — these mark answers.",
      "Watch for the trap of repeated words: the right answer is often a paraphrase, not the exact words you heard.",
      "Don't get stuck. If you miss one detail, let it go and stay with the speaker — panic costs you the next answer too."
    ]
  },
  {
    id: "L4", skill: "Listening", icon: "🎧", title: "Catching tone & inference",
    summary: "Part 6 (Viewpoints) and inference questions reward reading between the lines.",
    points: [
      "Speakers signal opinion with hedges and stress: 'to be honest', 'frankly', 'I'd say'. Note who holds which view.",
      "Distinguish fact from opinion. Questions often ask what the speaker implies, not states.",
      "Track contrast words ('but', 'although', 'on the other hand') — the speaker's real position usually follows them.",
      "For multi-speaker clips, jot a one-word tag per speaker (pro / con / unsure) as you listen."
    ]
  },
  {
    id: "L5", skill: "Writing", icon: "✍️", title: "Email & opinion blueprints",
    summary: "A repeatable structure for both writing tasks.",
    points: [
      "Email (Task 1): 1) reason for writing, 2) details/background, 3) request or proposal, 4) polite close. Match tone to the reader.",
      "Survey/Opinion (Task 2): 1) state your choice, 2) reason one + example, 3) reason two + example, 4) conclusion.",
      "Aim for 150–200 words. Going far over wastes time and adds errors; going under caps your score.",
      "Spend the last 2 minutes proofreading for the three killers: verb tense, articles (a/an/the), and subject–verb agreement."
    ],
    phrases: [
      "I am writing to let you know that…",
      "I would be grateful if you could…",
      "In my view, the benefits clearly outweigh the drawbacks."
    ]
  },
  {
    id: "L6", skill: "Grammar", icon: "✓", title: "The errors that cap your band",
    summary: "Fix these high-frequency mistakes to unlock 11–12.",
    points: [
      "Articles: use 'the' for specific/known things, 'a/an' for one-of-many, and no article for general plurals/uncountables.",
      "Tense consistency: don't drift between past and present inside one story. Pick a timeline and stay on it.",
      "Subject–verb agreement with tricky subjects: 'Each of the students IS…', 'The team of experts HAS…'.",
      "Prepositions are memorized, not derived: 'responsible FOR', 'comply WITH', 'depend ON', 'interested IN'. Collect and drill them."
    ]
  },
  {
    id: "L7", skill: "Natural", icon: "💬", title: "Sound natural, not memorized",
    summary: "Naturalness is a scored trait — here's how to perform it.",
    points: [
      "Contract everything in speech: I'd, you're, it's, they've. Full forms sound stiff and lower your fluency impression.",
      "Sprinkle (don't flood) idioms and phrasal verbs: 'figure out', 'a piece of cake', 'on the same page'.",
      "Use natural softeners: 'kind of', 'a bit', 'I guess', 'probably'. They make you sound like a confident speaker, not a robot.",
      "Vary your intonation: stress the important word in each sentence and let your pitch fall at the end of statements."
    ],
    phrases: [
      "It's kind of a tricky situation, to be honest.",
      "I'd probably just figure it out as I go.",
      "We're pretty much on the same page about that."
    ]
  },
  {
    id: "L8", skill: "Strategy", icon: "🎯", title: "Test-day game plan",
    summary: "Manage time, nerves, and energy across the whole test.",
    points: [
      "The test is ~3 hours and back-to-back. Build stamina by doing full mock exams, not just single drills.",
      "Speaking: use every second of prep to jot 2–3 keywords, not full sentences. Then talk to the keywords.",
      "If your mic test sounds off, fix it before you start — audio quality affects how clearly you're understood.",
      "Don't aim for perfection; aim for fluent, developed, on-topic answers. A flowing answer with a tiny slip beats a perfect half-answer."
    ]
  },
  {
    id: "L9", skill: "Strategy", icon: "🎯", title: "Build a 12-level vocabulary",
    summary: "Precise words and collocations are what separate 9 from 12.",
    points: [
      "Upgrade vague words: 'good' → 'worthwhile / impressive / solid'; 'bad' → 'disappointing / harmful'; 'a lot' → 'a great deal'.",
      "Learn words in collocations, not alone: 'make a decision', 'reach an agreement', 'raise concerns', 'meet a deadline'.",
      "Keep a personal list of 5 new useful phrases per day and actually use them in your speaking recordings.",
      "Topic-prep: prepare flexible ideas/vocabulary for common themes — work, technology, environment, education, city life."
    ],
    phrases: [
      "That would make a real difference in the long run.",
      "It's worth weighing up the pros and cons.",
      "We managed to reach an agreement in the end."
    ]
  }
];

export const LESSON_SKILL_ORDER = ["Speaking", "Listening", "Writing", "Grammar", "Natural", "Strategy"];
