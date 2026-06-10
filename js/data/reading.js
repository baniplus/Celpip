// Reading passages used by the Mock Exams (CELPIP-style reading comprehension).
export const READING_PASSAGES = [
  {
    id: "rd1",
    part: "Reading Correspondence",
    title: "Email: Community Garden",
    text: `Hi Daniel,

Thanks again for offering to help with the community garden this spring. As we discussed, the plots near the south fence get the most sun, so we'll plant the tomatoes and peppers there. The shadier beds by the shed are better suited to lettuce and herbs.

One change since we last spoke: the city has asked us to install a rain barrel before they'll renew our water permit. It isn't expensive, but someone needs to pick one up and set it up by the end of the month. Would you be able to handle that? If not, I can ask Priya, though she's away until the 20th.

Let me know which weekend works for the big planting day. I'm free both Saturdays, but the second one would give us more time to prepare the soil.

Best,
Maria`,
    questions: [
      { q: "Why does Maria suggest planting lettuce by the shed?", options: ["It has the most sun", "It is shadier there", "It is closest to the gate", "The soil is richer"], answer: 1, why: "She says the shadier beds by the shed suit lettuce and herbs." },
      { q: "What new requirement did the city introduce?", options: ["A larger fence", "A rain barrel", "A second water permit fee", "A planting schedule"], answer: 1, why: "The city asked them to install a rain barrel before renewing the water permit." },
      { q: "What is the issue with asking Priya to get the rain barrel?", options: ["She refuses to help", "She is away until the 20th", "She has no transport", "She dislikes the garden"], answer: 1, why: "Maria notes Priya is away until the 20th." },
      { q: "Why might the second Saturday be better for planting?", options: ["More volunteers attend", "It is warmer", "It allows more time to prepare the soil", "The shed is unlocked"], answer: 2, why: "Maria says the second Saturday would give more time to prepare the soil." }
    ]
  },
  {
    id: "rd2",
    part: "Reading for Information",
    title: "Notice: Library Hours",
    text: `Effective the first of next month, the Riverside Library will adjust its operating hours. The branch will open one hour earlier on weekdays, at 8 a.m., to better serve commuters and students. To balance staffing, weekday closing time will move from 9 p.m. to 8 p.m. Saturday hours remain unchanged (10 a.m. to 5 p.m.), and the library will now open on Sundays from noon to 4 p.m. for the first time. The popular evening study rooms will still be available until closing, but bookings must now be made online rather than at the front desk. Patrons with questions are encouraged to speak with a staff member or consult the website.`,
    questions: [
      { q: "What is the new weekday opening time?", options: ["7 a.m.", "8 a.m.", "9 a.m.", "10 a.m."], answer: 1, why: "Weekdays now open one hour earlier, at 8 a.m." },
      { q: "What is changing about the study rooms?", options: ["They are being removed", "Bookings must be made online", "They close at noon", "They are now free"], answer: 1, why: "Bookings must now be made online instead of at the front desk." },
      { q: "Which is genuinely new for the library?", options: ["Saturday hours", "Sunday opening", "Evening study rooms", "A front desk"], answer: 1, why: "It will open on Sundays for the first time." }
    ]
  },
  {
    id: "rd3",
    part: "Reading to Apply a Diagram",
    title: "Workshop Sign-up",
    text: `The Maker Space is offering four weekend workshops. "Intro to 3D Printing" runs Saturday morning and requires no experience. "Laser Cutting Basics" is Saturday afternoon and asks that you complete the safety module online first. "Woodworking I" is Sunday morning, limited to eight people, and has a small materials fee. "Electronics for Beginners" runs Sunday afternoon and provides all components. Members may register for two workshops; non-members may register for one. All participants must wear closed-toe shoes.`,
    questions: [
      { q: "Which workshop requires a prerequisite before attending?", options: ["Intro to 3D Printing", "Laser Cutting Basics", "Woodworking I", "Electronics for Beginners"], answer: 1, why: "Laser Cutting Basics asks you to complete the safety module online first." },
      { q: "A non-member wants the most hands-on electronics session with no extra cost. Which fits and how many can they take?", options: ["Electronics, one workshop", "Woodworking, two workshops", "Electronics, two workshops", "Laser Cutting, one workshop"], answer: 0, why: "Electronics provides all components (no cost); non-members may register for only one." },
      { q: "What must all participants do?", options: ["Pay a materials fee", "Bring their own tools", "Wear closed-toe shoes", "Be a member"], answer: 2, why: "All participants must wear closed-toe shoes." }
    ]
  }
];
