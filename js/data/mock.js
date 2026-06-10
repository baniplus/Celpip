// CELPIP-style Mock Exams. Each exam chains timed sections (Listening, Reading,
// Writing, Speaking) and produces a results summary with an estimated band.
// Listening/Speaking reuse existing content by id; Reading uses reading.js.

export const MOCK_EXAMS = [
  {
    id: "mockA",
    title: "Mock Exam A",
    level: "Full mini-test",
    blurb: "Listening, Reading, Writing and Speaking — timed, back to back, like test day.",
    sections: [
      { type: "listening", title: "Listening", minutes: 12, setIds: ["ls1", "ls2", "ls4"] },
      { type: "reading", title: "Reading", minutes: 12, passageIds: ["rd1", "rd2"] },
      {
        type: "writing", title: "Writing — Email", minutes: 13, minWords: 150, maxWords: 200,
        prompt: "Your building's management is replacing the parking lot for two weeks. Write an email (150–200 words) to the property manager: explain how this affects you, ask two questions, and propose a solution.",
        checklist: [
          "Clear purpose stated in the first line",
          "Polite, appropriate tone for management",
          "Two specific questions included",
          "A concrete proposed solution",
          "150–200 words in organized paragraphs"
        ]
      },
      { type: "speaking", title: "Speaking", taskIds: [1, 5, 7] }
    ]
  },
  {
    id: "mockB",
    title: "Mock Exam B",
    level: "Full mini-test",
    blurb: "A second full simulation with fresh prompts to test you under time pressure.",
    sections: [
      { type: "listening", title: "Listening", minutes: 12, setIds: ["ls3", "ls5", "ls2"] },
      { type: "reading", title: "Reading", minutes: 12, passageIds: ["rd3", "rd2"] },
      {
        type: "writing", title: "Writing — Opinion", minutes: 26, minWords: 150, maxWords: 200,
        prompt: "Some cities are making their downtown car-free. Do you support this idea? Write 150–200 words giving your opinion with clear reasons and examples.",
        checklist: [
          "Clear position in the first sentence",
          "Two developed reasons, each with an example",
          "A counter-argument acknowledged and answered",
          "A strong concluding sentence",
          "Varied sentence structure and precise vocabulary"
        ]
      },
      { type: "speaking", title: "Speaking", taskIds: [2, 4, 6] }
    ]
  }
];
