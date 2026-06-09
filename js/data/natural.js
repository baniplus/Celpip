// Natural Speaking — the phrasing, rhythm, and idiom that separate a CLB 9
// from a CLB 12. Cards to study + a "say it naturally" rephrasing drill.

export const NATURAL_CARDS = [
  {
    id: "n1",
    title: "Connectors that sound effortless",
    note: "Use these to glue ideas together instead of stacking 'and… and… and'.",
    items: [
      { phrase: "That said, …", use: "Soften or pivot after a point. ‘It's pricey. That said, it lasts for years.’" },
      { phrase: "On top of that, …", use: "Add a stronger reason. ‘It's fast — and on top of that, it's cheap.’" },
      { phrase: "The thing is, …", use: "Introduce the real issue. ‘The thing is, I'd already made plans.’" },
      { phrase: "As far as I'm concerned, …", use: "Mark a strong opinion." },
      { phrase: "To be fair, …", use: "Concede a point before disagreeing." }
    ]
  },
  {
    id: "n2",
    title: "Everyday idioms (use sparingly, naturally)",
    note: "One or two well-placed idioms lift your band. Don't force them.",
    items: [
      { phrase: "a piece of cake", use: "very easy. ‘The interview was a piece of cake.’" },
      { phrase: "on the same page", use: "in agreement. ‘Let's make sure we're on the same page.’" },
      { phrase: "call it a day", use: "stop for now. ‘We're tired — let's call it a day.’" },
      { phrase: "a blessing in disguise", use: "a hidden positive. ‘Missing that flight was a blessing in disguise.’" },
      { phrase: "go the extra mile", use: "make extra effort. ‘She always goes the extra mile for clients.’" }
    ]
  },
  {
    id: "n3",
    title: "Smart fillers (buy time without 'um')",
    note: "Replace dead 'uhh' with phrases that sound thoughtful and fluent.",
    items: [
      { phrase: "Let me think for a second…", use: "Buys time gracefully." },
      { phrase: "That's a good question.", use: "Natural stall while you plan." },
      { phrase: "How do I put this…", use: "Signals you're choosing words carefully." },
      { phrase: "Off the top of my head, …", use: "Introduce a quick estimate or example." },
      { phrase: "Well, it depends, really.", use: "Open a nuanced answer." }
    ]
  },
  {
    id: "n4",
    title: "Sound less robotic: contractions & softeners",
    note: "High scorers contract and hedge naturally. Full forms sound stiff.",
    items: [
      { phrase: "I'd / I've / I'll / it's / they're", use: "Always contract in speaking." },
      { phrase: "kind of / sort of", use: "Soften: ‘It's kind of expensive.’" },
      { phrase: "a bit / a little", use: "Hedge: ‘I'm a bit unsure.’" },
      { phrase: "probably / I guess / I'd say", use: "Adds natural uncertainty." },
      { phrase: "you know what I mean?", use: "Light conversational checking — use once, not constantly." }
    ]
  },
  {
    id: "n5",
    title: "Pronunciation & intonation tips",
    note: "Tap a tip's example with the 🔊 button to hear it spoken.",
    items: [
      { phrase: "Stress content words, not function words.", use: "I REALLY WANT to GO to the BEACH.", speak: "I really want to go to the beach." },
      { phrase: "Rise then fall for statements.", use: "Pitch up on the key word, glide down at the end.", speak: "The view from the top was absolutely stunning." },
      { phrase: "Use linking between words.", use: "‘turn off’ → ‘tur-noff’; ‘an apple’ → ‘a-napple’.", speak: "Could you turn off the lights and grab an apple?" },
      { phrase: "Pause at commas — don't rush.", use: "Chunking makes you sound in control.", speak: "First, I'd weigh the options, and then, I'd decide." }
    ]
  }
];

// "Say it naturally" — rewrite a stiff sentence into fluent, high-band English.
export const NATURAL_DRILLS = [
  { stiff: "It is my opinion that this is a very good idea.",
    natural: "Honestly, I think that's a great idea.",
    tip: "Drop 'It is my opinion that' — use 'I think' / 'Honestly'." },
  { stiff: "I am in agreement with your statement.",
    natural: "Yeah, I'm with you on that.",
    tip: "Contract and use everyday phrasing in speaking." },
  { stiff: "The reason is because I was very tired.",
    natural: "It's just that I was exhausted.",
    tip: "'The reason is because' is redundant; avoid it." },
  { stiff: "I will go to do the shopping later.",
    natural: "I'll pop out to do some shopping later.",
    tip: "Use 'I'll' and a phrasal verb to sound natural." },
  { stiff: "This situation is very difficult for me.",
    natural: "This is a bit of a tricky spot for me.",
    tip: "Idiomatic 'tricky spot' + softener 'a bit of'." },
  { stiff: "I do not know the answer at this moment.",
    natural: "I'm not sure off the top of my head.",
    tip: "Natural fillers beat stiff full forms." }
];
