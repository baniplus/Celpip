// CELPIP Listening practice. Passages are played via on-device Text-to-Speech
// (works on iOS Safari). Each item: a transcript (spoken), then comprehension
// questions with explanations. Covers the official listening part types.

export const LISTENING_SETS = [
  {
    id: "ls1",
    part: "Part 1 — Problem Solving",
    title: "The Missing Delivery",
    voices: 2,
    lines: [
      { s: "Woman", t: "Hi, I'm calling about a package that was supposed to arrive on Tuesday. It's now Friday and I still haven't received it." },
      { s: "Man", t: "I'm sorry to hear that. Could you give me your tracking number so I can look into it?" },
      { s: "Woman", t: "Sure, it's BX-four-four-nine-two-zero-one." },
      { s: "Man", t: "Thank you. It looks like the driver attempted delivery on Tuesday but no one was home, so it was returned to our depot." },
      { s: "Woman", t: "That's strange — I was home all day Tuesday and no one knocked." },
      { s: "Man", t: "I understand your frustration. The simplest fix would be to reschedule for tomorrow morning, or you could pick it up from the depot today after three o'clock." },
      { s: "Woman", t: "I'd rather not drive across town. Let's reschedule for tomorrow, but please ask the driver to ring the doorbell this time." }
    ],
    questions: [
      { q: "Why was the package not delivered on Tuesday?",
        options: ["It was damaged in transit", "The address was wrong", "The driver said no one was home", "It was lost at the depot"],
        answer: 2,
        why: "The man says the driver 'attempted delivery but no one was home' — even though the woman disputes it." },
      { q: "What solution does the woman finally choose?",
        options: ["Pick up from the depot today", "Reschedule for tomorrow morning", "Cancel the order", "Have it sent to a neighbour"],
        answer: 1,
        why: "She rejects driving to the depot and says 'Let's reschedule for tomorrow.'" },
      { q: "What special request does she make?",
        options: ["A refund", "A discount on shipping", "That the driver ring the doorbell", "A morning phone call"],
        answer: 2,
        why: "She asks the driver to 'ring the doorbell this time.'" }
    ]
  },
  {
    id: "ls2",
    part: "Part 2 — Daily Life Conversation",
    title: "Weekend Plans",
    voices: 2,
    lines: [
      { s: "Man", t: "Hey, do you have anything going on this weekend?" },
      { s: "Woman", t: "Not much. I was thinking of finally trying that new hiking trail by the lake. Want to come?" },
      { s: "Man", t: "I'd love to, but the forecast says rain on Saturday. Maybe Sunday would be safer?" },
      { s: "Woman", t: "Good point. Sunday works for me. We could start early and grab brunch afterwards." },
      { s: "Man", t: "Perfect. I'll bring my camera — the views from the ridge are supposed to be incredible." },
      { s: "Woman", t: "Great. Let's meet at the trailhead around eight so we beat the crowds." }
    ],
    questions: [
      { q: "Why do they change the day of their plan?",
        options: ["The trail is closed Saturday", "Rain is forecast for Saturday", "The woman is busy Saturday", "The man has to work"],
        answer: 1, why: "The man notes 'the forecast says rain on Saturday.'" },
      { q: "What will they do after the hike?",
        options: ["Go to the gym", "Have brunch", "Visit a museum", "Go shopping"],
        answer: 1, why: "She suggests they 'grab brunch afterwards.'" },
      { q: "Why do they plan to start at eight?",
        options: ["To beat the crowds", "To catch the sunrise", "The trail closes early", "To avoid the heat"],
        answer: 0, why: "She says 'so we beat the crowds.'" }
    ]
  },
  {
    id: "ls3",
    part: "Part 4 — News Item",
    title: "City Library Expansion",
    voices: 1,
    lines: [
      { s: "Reporter", t: "The city council announced today that the downtown public library will undergo a major expansion beginning this autumn. The two-year project will add a dedicated children's wing, forty new study rooms, and a rooftop reading garden. Officials say the renovation responds to a thirty percent rise in library visits over the past three years, driven largely by demand for free workspace and community programs. During construction, core services will continue from a temporary location in the former post office on Main Street. The council expects the expanded library to open to the public in the spring of the year after next." }
    ],
    questions: [
      { q: "What is the main reason for the expansion?",
        options: ["A government grant required it", "A sharp rise in library visits", "The old building was unsafe", "A donation from a local business"],
        answer: 1, why: "The rise of thirty percent in visits is cited as the driver." },
      { q: "Where will services run during construction?",
        options: ["A nearby school", "The city hall", "The former post office", "Online only"],
        answer: 2, why: "Core services move 'to a temporary location in the former post office on Main Street.'" },
      { q: "Which feature is NOT mentioned?",
        options: ["A rooftop reading garden", "A children's wing", "A café", "New study rooms"],
        answer: 2, why: "A café is never mentioned; the others all are." }
    ]
  },
  {
    id: "ls4",
    part: "Part 6 — Viewpoints",
    title: "Remote Work Debate",
    voices: 1,
    lines: [
      { s: "Speaker", t: "When it comes to remote work, opinions remain sharply divided. Supporters argue that working from home boosts productivity by eliminating commutes and reducing office distractions. They also point to better work-life balance and access to a wider talent pool. Critics, however, contend that remote work weakens collaboration and makes it harder for junior employees to learn from mentors. Some managers worry about accountability, though studies increasingly suggest output, not hours, is what matters. My own view is that a hybrid model captures the best of both worlds: the focus of home and the spontaneous creativity of the office. The key is flexibility, not a one-size-fits-all mandate." }
    ],
    questions: [
      { q: "What benefit of remote work do supporters mention?",
        options: ["Higher salaries", "Eliminating commutes", "More office parties", "Shorter projects"],
        answer: 1, why: "Supporters cite 'eliminating commutes and reducing office distractions.'" },
      { q: "What concern do critics raise?",
        options: ["It costs companies more", "It weakens collaboration and mentoring", "It is illegal in some places", "It requires expensive equipment"],
        answer: 1, why: "Critics say it 'weakens collaboration and makes it harder for junior employees to learn from mentors.'" },
      { q: "What is the speaker's own position?",
        options: ["Fully remote is best", "Fully in-office is best", "A hybrid model is best", "Remote work should be banned"],
        answer: 2, why: "The speaker favours 'a hybrid model' and 'flexibility, not a one-size-fits-all mandate.'" }
    ]
  },
  {
    id: "ls5",
    part: "Part 3 — Information",
    title: "How Sleep Cycles Work",
    voices: 1,
    lines: [
      { s: "Speaker", t: "Each night, your brain moves through several sleep cycles, and each cycle lasts roughly ninety minutes. A cycle has two broad phases. First comes non-REM sleep, which includes the deep, slow-wave stage where your body repairs tissue and strengthens the immune system. Then comes REM sleep — rapid eye movement — when most vivid dreaming happens and the brain consolidates memories. Interestingly, REM periods grow longer toward morning, which is why you often wake from a dream. Experts recommend waking at the end of a cycle rather than the middle, because being roused from deep sleep is what leaves you groggy. This is why a shorter sleep that ends on a cycle boundary can sometimes feel more refreshing than a longer one cut off mid-cycle." }
    ],
    questions: [
      { q: "About how long is one sleep cycle?",
        options: ["30 minutes", "Ninety minutes", "Three hours", "Fifteen minutes"],
        answer: 1, why: "The speaker states each cycle 'lasts roughly ninety minutes.'" },
      { q: "What happens mainly during REM sleep?",
        options: ["Tissue repair", "Vivid dreaming and memory consolidation", "Slow-wave deep rest", "The immune system shuts down"],
        answer: 1, why: "REM is when 'most vivid dreaming happens and the brain consolidates memories.'" },
      { q: "Why might a shorter sleep feel more refreshing?",
        options: ["It avoids dreaming", "It ends on a cycle boundary instead of mid-cycle", "It includes more REM", "It skips deep sleep entirely"],
        answer: 1, why: "Waking at a cycle boundary avoids the grogginess of being roused from deep sleep." }
    ]
  }
];
