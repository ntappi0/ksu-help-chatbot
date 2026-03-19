export type WebSnippet = {
  id: string;
  category: string;
  title: string;
  content: string;
  source_title: string;
  source_url: string;
  keywords: string[];
};

export const ksuWebSnippets: WebSnippet[] = [
  {
    id: "dining-purchase-meal-plan",
    category: "Dining",
    title: "How students purchase a meal plan",
    content:
      "Students who live on campus receive a default meal plan tied to housing and board charges. Students who live off campus can purchase a meal plan through the Transact Mobile Ordering app, choose Kennesaw State University Dining, log in with their KSU student email and password, and apply the cost to their student account or pay by card.",
    source_title: "Campus Dining FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/dining/frequently-asked-questions.php",
    keywords: ["meal plan", "purchase", "buy", "transact", "dining", "off campus", "on campus"],
  },
  {
    id: "dining-check-balance",
    category: "Dining",
    title: "How to check unused meal-plan balance",
    content:
      "Students can check meal-plan and Dining Dollars balances through the Meal Plan Portal using their KSU email and password, then Duo verification. The portal shows plan usage, remaining entries, and Dining Dollars transactions and balance.",
    source_title: "Campus Dining FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/dining/frequently-asked-questions.php",
    keywords: ["meal plan", "balance", "unused", "dining dollars", "portal", "leftover"],
  },
  {
    id: "dining-both-campuses",
    category: "Dining",
    title: "Meal plans on both campuses",
    content:
      "Meal plans work on both campuses. Meal plans allow access to The Commons on the Kennesaw Campus and Stingers on the Marietta Campus. Dining Dollars can be used at restaurants on either campus.",
    source_title: "Campus Dining FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/dining/frequently-asked-questions.php",
    keywords: ["both campuses", "marietta", "kennesaw", "meal plan", "dining dollars"],
  },
  {
    id: "dining-financial-aid",
    category: "Dining",
    title: "Using financial aid for meal plans",
    content:
      "Certain kinds of financial aid may be used for board expenses such as meal plans, but students should work with the Office of Student Financial Aid to confirm what aid applies. HOPE Scholarship does not cover meal-plan expenses.",
    source_title: "Campus Dining FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/dining/frequently-asked-questions.php",
    keywords: ["financial aid", "meal plan", "hope", "board expenses", "dining"],
  },
  {
    id: "testing-location",
    category: "Testing Center",
    title: "Testing Center location",
    content:
      "The Testing Center is located in the KSU Center at 3333 Busbee Drive, Suite 350, and the entrance is on the west entrance of the building.",
    source_title: "Testing Center FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/academics/testing-center/frequently-asked-questions/index.php",
    keywords: ["testing center", "location", "where", "address", "busbee"],
  },
  {
    id: "testing-schedule",
    category: "Testing Center",
    title: "Scheduling a testing appointment",
    content:
      "Students can schedule a testing appointment online. If they need help, they can call 470-578-4800 to speak with testing staff.",
    source_title: "Testing Center FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/academics/testing-center/frequently-asked-questions/index.php",
    keywords: ["schedule", "appointment", "testing", "exam", "book"],
  },
  {
    id: "testing-fees-id",
    category: "Testing Center",
    title: "Testing fees and what to bring",
    content:
      "Testing fees are paid online with a major credit or debit card when scheduling. Test takers must bring a current valid government-issued photo ID with name and signature. They should arrive at least 15 minutes early.",
    source_title: "Testing Center FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/academics/testing-center/frequently-asked-questions/index.php",
    keywords: ["testing fees", "pay", "id", "identification", "arrive", "early"],
  },
  {
    id: "scholarship-types",
    category: "Scholarships",
    title: "Types of scholarships on ScholarshipUniverse",
    content:
      "ScholarshipUniverse includes scholarships based on major, minor, college, department, academic merit, financial need, hobbies, interests, affiliations, and more. It includes both university scholarships and external scholarships.",
    source_title: "Scholarship FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/financial-aid/scholarships/faqs.php",
    keywords: ["scholarship", "scholarships", "types", "scholarshipuniverse", "financial aid"],
  },
  {
    id: "scholarship-start",
    category: "Scholarships",
    title: "How to start using ScholarshipUniverse",
    content:
      "To start using ScholarshipUniverse, students log in and complete a student profile by answering questions used to match them with scholarships they may be eligible for.",
    source_title: "Scholarship FAQs",
    source_url:
      "https://campus.kennesaw.edu/current-students/financial-aid/scholarships/faqs.php",
    keywords: ["scholarshipuniverse", "start", "profile", "eligible", "match"],
  },
  {
    id: "careers-handshake-register",
    category: "Careers",
    title: "Registering for Handshake",
    content:
      "Currently enrolled students are automatically set up in Handshake at the beginning of each semester. They log in with their KSU NetID and password and complete their profile.",
    source_title: "Careers FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/careers/faqs.php",
    keywords: ["handshake", "register", "login", "career", "netid"],
  },
  {
    id: "careers-job-application",
    category: "Careers",
    title: "Applying for jobs in Handshake",
    content:
      "To apply for a job in Handshake, students need an approved resume and any other approved documents required for the posting.",
    source_title: "Careers FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/careers/faqs.php",
    keywords: ["apply", "job", "handshake", "resume", "approved documents"],
  },
  {
    id: "careers-internship-credit",
    category: "Careers",
    title: "Internship and co-op credit basics",
    content:
      "To register for internship or co-op academic credit, students first submit an application through the appropriate career process for their college. After approval, they receive the CRN by email. Internship and co-op courses may involve tuition and fee considerations depending on the course.",
    source_title: "Careers FAQs",
    source_url:
      "https://campus.kennesaw.edu/offices-services/careers/faqs.php",
    keywords: ["internship", "co-op", "credit", "crn", "career advisor"],
  },
  {
    id: "dli-request-support",
    category: "Digital Learning Innovations",
    title: "Requesting DLI support",
    content:
      "Faculty can request Digital Learning Support by using the Contact Us option or the Questions? Ask Us link on the DLI site.",
    source_title: "Digital Learning Innovations FAQs",
    source_url:
      "https://campus.kennesaw.edu/faculty-staff/academic-affairs/curriculum-instruction-assessment/digital-learning-innovations/about/frequently-asked-questions.php",
    keywords: ["dli", "digital learning", "support", "contact us", "instructional design"],
  },
  {
    id: "dli-d2l-support",
    category: "Digital Learning Innovations",
    title: "D2L support routing",
    content:
      "For D2L issues, the UITS Service Desk is the first line of support. For instructional design or pedagogical questions, faculty should contact Digital Learning Innovations.",
    source_title: "Digital Learning Innovations FAQs",
    source_url:
      "https://campus.kennesaw.edu/faculty-staff/academic-affairs/curriculum-instruction-assessment/digital-learning-innovations/about/frequently-asked-questions.php",
    keywords: ["d2l", "service desk", "uits", "faculty", "digital learning"],
  },
];