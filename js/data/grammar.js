// Grammar drills — advanced points that matter for a CLB 11–12 score.
// Each question gives instant feedback and an explanation that teaches the rule.

export const GRAMMAR_SETS = [
  {
    id: "g1",
    title: "Verb Tenses & Aspect",
    questions: [
      { q: "By the time the meeting ended, we ___ for over three hours.",
        options: ["talked", "have talked", "had been talking", "are talking"],
        answer: 2,
        why: "Past perfect continuous (had been talking) shows an action ongoing up to a point in the past." },
      { q: "I ___ here since 2019, and I still love it.",
        options: ["work", "have been working", "had worked", "am working"],
        answer: 1,
        why: "Present perfect continuous links a past start ('since 2019') to the present." },
      { q: "This time next week, I ___ on a beach in Portugal.",
        options: ["will lie", "will be lying", "lie", "have lain"],
        answer: 1,
        why: "Future continuous (will be lying) describes an action in progress at a future moment." },
      { q: "She said she ___ the report by Friday.",
        options: ["will finish", "would finish", "finishes", "had finish"],
        answer: 1,
        why: "In reported speech, 'will' shifts back to 'would'." }
    ]
  },
  {
    id: "g2",
    title: "Conditionals",
    questions: [
      { q: "If I ___ about the traffic, I would have left earlier.",
        options: ["knew", "had known", "would know", "know"],
        answer: 1,
        why: "Third conditional: 'if + past perfect, would have + participle' for unreal past." },
      { q: "If you heat water to 100°C, it ___.",
        options: ["would boil", "boiled", "boils", "will have boiled"],
        answer: 2,
        why: "Zero conditional for general truths uses present + present." },
      { q: "Were I in charge, I ___ the policy immediately.",
        options: ["will change", "would change", "changed", "have changed"],
        answer: 1,
        why: "Inverted second conditional ('Were I…') pairs with 'would + base'." },
      { q: "If the package ___ today, please sign for it.",
        options: ["arrived", "arrives", "would arrive", "had arrived"],
        answer: 1,
        why: "First conditional with a request: 'if + present, imperative'." }
    ]
  },
  {
    id: "g3",
    title: "Articles & Determiners",
    questions: [
      { q: "She is ___ honest person and ___ best manager we've had.",
        options: ["a / the", "an / the", "an / a", "the / the"],
        answer: 1,
        why: "'Honest' starts with a vowel sound → 'an'; superlatives take 'the'." },
      { q: "I don't have ___ information about that.",
        options: ["many", "much", "a few", "several"],
        answer: 1,
        why: "'Information' is uncountable, so use 'much' (not 'many')." },
      { q: "___ of the two options is clearly better.",
        options: ["Either", "Both", "All", "None"],
        answer: 0,
        why: "'Either' selects one of two; it takes a singular verb." },
      { q: "There were ___ people at the event than expected.",
        options: ["less", "fewer", "lesser", "little"],
        answer: 1,
        why: "'Fewer' is used with countable nouns (people); 'less' with uncountable." }
    ]
  },
  {
    id: "g4",
    title: "Prepositions & Collocations",
    questions: [
      { q: "The decision was made ___ accordance ___ the new rules.",
        options: ["on / to", "in / with", "by / of", "at / for"],
        answer: 1,
        why: "Fixed phrase: 'in accordance with'." },
      { q: "She's responsible ___ training new staff.",
        options: ["of", "to", "for", "on"],
        answer: 2,
        why: "'Responsible for' (a task); 'responsible to' would mean answerable to a person." },
      { q: "We need to comply ___ the safety regulations.",
        options: ["to", "with", "for", "on"],
        answer: 1,
        why: "'Comply with' is the correct collocation." },
      { q: "I'm not very keen ___ spicy food.",
        options: ["on", "of", "with", "for"],
        answer: 0,
        why: "'Keen on' something is the standard collocation." }
    ]
  },
  {
    id: "g5",
    title: "Parallelism & Sentence Structure",
    questions: [
      { q: "Which sentence is grammatically parallel?",
        options: [
          "She likes hiking, to swim, and biking.",
          "She likes hiking, swimming, and biking.",
          "She likes to hike, swimming, and bikes.",
          "She likes hike, swim, and to bike."],
        answer: 1,
        why: "All three items should share the same form: '-ing, -ing, -ing'." },
      { q: "Choose the correctly punctuated sentence.",
        options: [
          "I finished the report, I sent it to my boss.",
          "I finished the report I sent it to my boss.",
          "I finished the report, and I sent it to my boss.",
          "I finished the report and, I sent it to my boss."],
        answer: 2,
        why: "Two independent clauses need a comma + coordinating conjunction (comma splice avoided)." },
      { q: "Which uses the modifier correctly?",
        options: [
          "Walking to work, the rain soaked my coat.",
          "Walking to work, I got soaked by the rain.",
          "The rain, walking to work, soaked me.",
          "Soaked the rain me walking to work."],
        answer: 1,
        why: "The subject after the introductory phrase must be the one doing the walking — 'I'. Avoids a dangling modifier." },
      { q: "Pick the most concise, formal version.",
        options: [
          "Due to the fact that it was late, we left.",
          "Because it was late, we left.",
          "On account of the lateness of the hour, we departed.",
          "It being late, so we left."],
        answer: 1,
        why: "'Because' is concise and correct; 'due to the fact that' is wordy padding to avoid." }
    ]
  }
];
