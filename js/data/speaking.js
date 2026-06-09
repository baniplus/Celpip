// CELPIP Speaking — 8 official task types, tuned for a CLB 12 target.
// Each task has prep/response timing matching the real test, multiple prompts,
// a model-answer framework, high-band "power phrases", and a self-assessment rubric.

export const SPEAKING_TASKS = [
  {
    id: 1,
    title: "Giving Advice",
    prep: 30,
    response: 90,
    blurb: "Advise a person about a situation. Be clear, structured, and supportive.",
    prompts: [
      "Your friend has been offered a job in another city but is unsure about moving. Give them advice.",
      "A coworker keeps missing deadlines and is stressed. Advise them on how to manage their workload.",
      "Your cousin wants to buy their first car but has a limited budget. Give them advice.",
      "A friend wants to learn English faster for an exam. Advise them on the best approach."
    ],
    framework: [
      "Acknowledge the situation (1 sentence): 'I can see why you'd feel torn about this.'",
      "Give 2–3 concrete recommendations, each with a reason.",
      "Add a 'what I would do' personal angle to sound natural.",
      "Close with encouragement: 'Whatever you decide, I'm sure it'll work out.'"
    ],
    power: [
      "If I were in your shoes, I'd…",
      "The way I see it, you've got two solid options.",
      "What's worked for me in the past is…",
      "It might be worth weighing up the pros and cons.",
      "At the end of the day, it's your call, but…"
    ]
  },
  {
    id: 2,
    title: "Talking about a Personal Experience",
    prep: 30,
    response: 60,
    blurb: "Tell a short story from your own life. Use vivid past-tense narration.",
    prompts: [
      "Describe a time you helped a stranger.",
      "Talk about a memorable trip you took.",
      "Describe a time you overcame a difficult challenge.",
      "Talk about an accomplishment you're proud of."
    ],
    framework: [
      "Set the scene: when, where, who (1 sentence).",
      "Build the story with sequencing words (first, then, suddenly).",
      "Add one emotional beat: how you felt in the moment.",
      "End with the outcome and what it meant to you."
    ],
    power: [
      "This happened a couple of years back, when…",
      "Out of nowhere, …",
      "To be honest, I was a little nervous at first.",
      "Looking back on it, …",
      "It's a memory that's really stuck with me."
    ]
  },
  {
    id: 3,
    title: "Describing a Scene",
    prep: 30,
    response: 60,
    blurb: "Describe a picture in detail. Cover people, place, actions, and atmosphere.",
    prompts: [
      "Describe a busy farmers' market on a sunny morning.",
      "Describe a family having a picnic in a park.",
      "Describe a crowded train station at rush hour.",
      "Describe a group of friends celebrating at a restaurant."
    ],
    framework: [
      "Overview first: 'This looks like a…'",
      "Foreground → background, or left → right, systematically.",
      "Use present continuous: 'A man is…', 'Some children are…'",
      "Add inferred details: weather, mood, what just/likely happened."
    ],
    power: [
      "In the foreground, …",
      "Off to the left/right, you can see…",
      "It looks as though…",
      "Judging by their expressions, they seem…",
      "In the background, there's…"
    ]
  },
  {
    id: 4,
    title: "Making Predictions",
    prep: 30,
    response: 60,
    blurb: "Predict what will happen next in a scene. Use future forms with reasons.",
    prompts: [
      "Predict what will happen next: dark clouds gather over an outdoor wedding.",
      "Predict what will happen next: a child reaches for a glass near the table edge.",
      "Predict what will happen next: two cyclists approach a sharp, wet corner.",
      "Predict what will happen next: a chef carries a tall stack of plates."
    ],
    framework: [
      "Describe the setup briefly (1 sentence).",
      "Make 2–3 predictions, each with a 'because' justification.",
      "Vary your future forms: will / going to / likely to / about to.",
      "End with the most probable outcome."
    ],
    power: [
      "It looks like they're about to…",
      "Chances are, …",
      "I'd say it's very likely that…",
      "If that happens, then…",
      "In all probability, …"
    ]
  },
  {
    id: 5,
    title: "Comparing and Persuading",
    prep: 60,
    response: 60,
    blurb: "Choose between two options for someone and persuade them of your choice.",
    prompts: [
      "Persuade a relative to choose either a beach holiday or a city holiday.",
      "Recommend either a laptop or a tablet for a student and persuade them.",
      "Persuade a friend to choose either a gym membership or home workouts.",
      "Recommend either a house in the suburbs or an apartment downtown."
    ],
    framework: [
      "State your recommendation clearly and confidently up front.",
      "Give 2 strong reasons tailored to the person's needs.",
      "Briefly acknowledge the other option, then dismiss it politely.",
      "Close with a confident call to action."
    ],
    power: [
      "Honestly, I'd go with… and here's why.",
      "Given what you're after, this is the better fit.",
      "Sure, the other one has its perks, but…",
      "Trust me on this one — you won't regret it.",
      "All things considered, this is the smarter choice."
    ]
  },
  {
    id: 6,
    title: "Dealing with a Difficult Situation",
    prep: 60,
    response: 60,
    blurb: "Navigate an awkward situation. Pick an approach and explain it tactfully.",
    prompts: [
      "Your friend lent you a jacket and you damaged it. Explain the situation to them.",
      "You double-booked plans with two friends on the same night. Resolve it.",
      "A neighbour's loud parties keep you awake. Address it with them.",
      "You received the wrong order at a restaurant. Speak to the server."
    ],
    framework: [
      "Choose ONE clear approach and commit to it.",
      "Open diplomatically — soften before the issue.",
      "State the problem and your proposed solution.",
      "End on a cooperative, face-saving note."
    ],
    power: [
      "I hope you don't mind me bringing this up, but…",
      "I feel terrible about this — let me make it right.",
      "Would it be possible to…?",
      "I completely understand, and here's what I can do.",
      "Let's find a way that works for both of us."
    ]
  },
  {
    id: 7,
    title: "Expressing Opinions",
    prep: 30,
    response: 90,
    blurb: "Give and defend your opinion on a statement. Take a firm, reasoned stance.",
    prompts: [
      "Some people think social media does more harm than good. Do you agree?",
      "Should public transit be free for everyone? Give your opinion.",
      "Is it better to work for a big company or a small one? Why?",
      "Should students be required to learn a second language? Why or why not?"
    ],
    framework: [
      "State your position unambiguously in the first sentence.",
      "Give 2 reasons, each developed with an example.",
      "Address a counterpoint, then rebut it.",
      "Restate your position with a memorable closing line."
    ],
    power: [
      "I firmly believe that…",
      "There are a couple of reasons I feel this way.",
      "Take, for example, …",
      "Now, some might argue…, but I'd counter that…",
      "So all in all, I'm convinced that…"
    ]
  },
  {
    id: 8,
    title: "Describing an Unusual Situation",
    prep: 30,
    response: 60,
    blurb: "Describe something strange in a picture to someone who can't see it.",
    prompts: [
      "Describe an unusual object you saw: a chair shaped like a giant hand.",
      "Describe a strange sight: a dog wearing a full business suit.",
      "Describe an odd scene: a car completely covered in grass.",
      "Describe something unusual: a tree growing inside a living room."
    ],
    framework: [
      "Name the unusual thing and your reaction (1 sentence).",
      "Describe it precisely — size, colour, shape, position.",
      "Compare it to something familiar to aid understanding.",
      "Speculate about why it might be there."
    ],
    power: [
      "You won't believe what I'm looking at.",
      "It's roughly the size of…",
      "It kind of reminds me of…",
      "The strangest part is…",
      "I can only assume that…"
    ]
  }
];

export const SPEAKING_RUBRIC = [
  { key: "content", label: "Content & coverage", hint: "Did you fully address the task and develop your ideas?" },
  { key: "vocab", label: "Vocabulary range", hint: "Precise, varied, idiomatic word choice (CLB 11–12)." },
  { key: "grammar", label: "Grammar accuracy", hint: "Complex structures used accurately and flexibly." },
  { key: "fluency", label: "Fluency & flow", hint: "Smooth pace, minimal hesitation, natural rhythm." },
  { key: "pron", label: "Pronunciation", hint: "Clear sounds, word stress, and sentence intonation." }
];
